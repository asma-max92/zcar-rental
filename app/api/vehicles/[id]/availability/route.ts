import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing startDate or endDate" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    if (!vehicle.available) {
      return NextResponse.json({ available: false, reason: "Vehicle is not available" });
    }

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return NextResponse.json(
        { error: "Invalid dates provided" },
        { status: 400 }
      );
    }
    if (parsedStart > parsedEnd) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        vehicleId: params.id,
        status: { in: ["pending", "confirmed"] },
        OR: [
          {
            startDate: { lte: parsedEnd },
            endDate: { gte: parsedStart },
          },
        ],
      },
    });

    // Check for blocked dates (Turo + other sources)
    const overlappingBlocked = await prisma.blockedDate.findMany({
      where: {
        vehicleId: params.id,
        OR: [
          {
            startDate: { lte: parsedEnd },
            endDate: { gte: parsedStart },
          },
        ],
      },
    });

    const totalOverlaps = overlappingBookings.length + overlappingBlocked.length;
    const available = totalOverlaps === 0;

    return NextResponse.json({
      available,
      reason: available
        ? undefined
        : overlappingBlocked.length > 0
        ? "Vehicle is not available for these dates"
        : "Vehicle is already booked for these dates",
      overlappingBookings: available ? undefined : overlappingBookings.length,
      overlappingBlocked: available ? undefined : overlappingBlocked.length,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
