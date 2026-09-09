import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fetchTuroCalendar } from "@/lib/ical";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    if (!vehicle.turoIcalUrl) {
      return NextResponse.json(
        { error: "No Turo iCal URL configured for this vehicle" },
        { status: 400 }
      );
    }

    // Fetch and parse Turo calendar
    const events = await fetchTuroCalendar(vehicle.turoIcalUrl);

    // Atomic transaction: delete old + insert new together
    const [, created] = await prisma.$transaction([
      prisma.blockedDate.deleteMany({
        where: {
          vehicleId: params.id,
          source: "turo",
        },
      }),
      prisma.blockedDate.createMany({
        data: events.map((event) => ({
          vehicleId: params.id,
          startDate: event.startDate,
          endDate: event.endDate,
          source: "turo",
          summary: event.summary || "Turo booking",
        })),
      }),
    ]);

    return NextResponse.json({
      success: true,
      vehicleId: params.id,
      vehicleName: `${vehicle.make} ${vehicle.model}`,
      eventsFound: events.length,
      blockedDatesCreated: created.count,
    });
  } catch (error) {
    console.error("Turo sync failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to sync Turo calendar", details: message },
      { status: 500 }
    );
  }
}
