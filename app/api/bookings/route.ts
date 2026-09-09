import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendCustomerConfirmation, sendAdminNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
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
    } = body;

    if (
      typeof vehicleId !== "string" || !vehicleId.trim() ||
      typeof startDate !== "string" || !startDate.trim() ||
      typeof endDate !== "string" || !endDate.trim() ||
      typeof pickupLocation !== "string" || !pickupLocation.trim() ||
      typeof dropoffLocation !== "string" || !dropoffLocation.trim() ||
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof phone !== "string" || !phone.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedStart = new Date(startDate.trim());
    const parsedEnd = new Date(endDate.trim());
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return NextResponse.json(
        { error: "Invalid dates provided" },
        { status: 400 }
      );
    }
    if (parsedStart > parsedEnd) {
      return NextResponse.json(
        { error: "Start date must be before or equal to end date" },
        { status: 400 }
      );
    }

    const computedDays = Math.max(
      1,
      Math.ceil(
        (parsedEnd.getTime() - parsedStart.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId.trim() },
      select: { make: true, model: true, dailyRate: true },
    });
    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    const totalAmount = vehicle.dailyRate * computedDays;

    const user = await prisma.user.upsert({
      where: { email: email.trim() },
      update: {},
      create: {
        email: email.trim(),
        password: "",
        firstName: name.trim().split(/\s+/)[0] || name.trim(),
        lastName: name.trim().split(/\s+/).slice(1).join(" ") || "",
        phone: phone.trim(),
      },
    });

    // Check for double-booking
    const overlapping = await prisma.booking.count({
      where: {
        vehicleId: vehicleId.trim(),
        status: { not: "cancelled" },
        OR: [
          {
            startDate: { lte: parsedEnd },
            endDate: { gte: parsedStart },
          },
        ],
      },
    });

    if (overlapping > 0) {
      return NextResponse.json(
        { error: "Vehicle is not available for the selected dates" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        vehicleId: vehicleId.trim(),
        startDate: parsedStart,
        endDate: parsedEnd,
        pickupLocation: pickupLocation.trim(),
        dropoffLocation: dropoffLocation.trim(),
        totalAmount,
        status: "pending",
        paymentStatus: "unpaid",
        notes: notes?.trim() || "",
      },
    });

    // Send confirmation emails
    const vehicleName = `${vehicle.make} ${vehicle.model}`;

    sendCustomerConfirmation({
      to: email.trim(),
      name: name.trim(),
      vehicleName,
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      pickupLocation: pickupLocation.trim(),
      totalAmount,
    }).catch((err) => console.error("Failed to send customer email:", err));

    sendAdminNotification({
      customerEmail: email.trim(),
      customerName: name.trim(),
      vehicleName,
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      pickupLocation: pickupLocation.trim(),
      totalAmount,
    }).catch((err) => console.error("Failed to send admin email:", err));

    return NextResponse.json(
      { success: true, id: booking.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
