import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      vehicleId,
      vehicleName,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      name,
      email,
      phone,
      notes,
      extras,
    } = body;

    if (!vehicleId || !email || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Compute days server-side from dates to prevent tampering
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return NextResponse.json(
        { error: "Invalid dates" },
        { status: 400 }
      );
    }
    const computedDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    // Validate total server-side to prevent tampering
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    const dailyRate = vehicle.dailyRate;
    const baseTotal = dailyRate * computedDays;

    let extrasData: { insurance?: string; addons?: Record<string, boolean>; insuranceTotal?: number; addonsTotal?: number } = {};
    try {
      extrasData = extras ? JSON.parse(extras) : {};
    } catch {
      return NextResponse.json(
        { error: "Invalid extras format" },
        { status: 400 }
      );
    }

    const insuranceRates: Record<string, number> = { basic: 0, premium: 3500, full: 6500 };
    const insuranceTotal = (insuranceRates[extrasData.insurance || "basic"] || 0) * computedDays;

    const addonRates: Record<string, number> = { childSeat: 2500, extraDriver: 7500, delivery: 7500 };
    const selectedAddons = extrasData.addons || {};
    let addonsTotal = 0;
    for (const [key, value] of Object.entries(selectedAddons)) {
      if (value && addonRates[key]) {
        addonsTotal += addonRates[key] * (key === "delivery" ? 1 : computedDays);
      }
    }

    const totalAmount = baseTotal + insuranceTotal + addonsTotal;

    // Check vehicle availability for the dates
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        vehicleId,
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
          },
        ],
      },
    });

    const existingBookings = await prisma.booking.findMany({
      where: {
        vehicleId,
        status: { notIn: ["cancelled"] },
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
          },
        ],
      },
    });

    if (blockedDates.length > 0 || existingBookings.length > 0) {
      return NextResponse.json(
        { error: "Vehicle is not available for the selected dates" },
        { status: 409 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Car Rental — ${vehicleName}`,
              description: `${computedDays} days from ${startDate} to ${endDate}`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/booking?vehicle=${vehicleId}`,
      customer_email: email,
      metadata: {
        vehicleId,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        name,
        email,
        phone: phone || "",
        notes: notes || "",
        days: String(computedDays),
        extras: extras || "",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
