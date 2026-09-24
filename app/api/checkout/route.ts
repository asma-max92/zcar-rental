import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ status: session.status });
  } catch (error) {
    console.error("Checkout verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify session" },
      { status: 500 }
    );
  }
}

function getBaseUrl(request: NextRequest): string {
  let url: string | undefined;

  // Priority: NEXTAUTH_URL > VERCEL_PROJECT_PRODUCTION_URL > VERCEL_URL > request origin
  if (process.env.NEXTAUTH_URL) {
    url = process.env.NEXTAUTH_URL;
  } else if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  } else if (process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`;
  } else {
    try {
      url = new URL(request.url).origin;
    } catch {
      url = "http://localhost:3000";
    }
  }

  // Strip trailing slash to avoid double slashes in URLs
  return url.replace(/\/$/, "");
}

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
      const parsed = extras ? JSON.parse(extras) : {};
      if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json(
          { error: "Invalid extras format" },
          { status: 400 }
        );
      }
      extrasData = parsed;
    } catch {
      return NextResponse.json(
        { error: "Invalid extras format" },
        { status: 400 }
      );
    }

    const insuranceRates: Record<string, number> = { basic: 0, premium: 3500, full: 6500 };
    const insuranceKey = extrasData.insurance || "basic";
    if (!Object.keys(insuranceRates).includes(insuranceKey)) {
      return NextResponse.json(
        { error: "Invalid insurance option" },
        { status: 400 }
      );
    }
    const insuranceTotal = insuranceRates[insuranceKey] * computedDays;

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

    const baseUrl = getBaseUrl(request);

    // Validate that production URLs are not localhost
    if (process.env.NODE_ENV === "production" && baseUrl.includes("localhost")) {
      console.error("Checkout error: NEXTAUTH_URL or VERCEL_URL must be set in production");
      return NextResponse.json(
        { error: "Server configuration error: missing production URL" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Car Rental — ${vehicle.make} ${vehicle.model}`,
              description: `${computedDays} days from ${startDate} to ${endDate}`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking?vehicle=${vehicleId}`,
      customer_email: email,
      metadata: {
        vehicleId,
        startDate,
        endDate,
        pickupLocation: pickupLocation || "",
        dropoffLocation: dropoffLocation || "",
        name: name || "",
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
    // Only surface Stripe errors to the client; hide internal/DB errors
    let message = "Failed to create checkout session";
    if (error instanceof Stripe.errors.StripeError || (error instanceof Error && error.name === "StripeError")) {
      message = (error as Error).message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
