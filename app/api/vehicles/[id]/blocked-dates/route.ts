import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    let where: { vehicleId: string; OR?: Array<{ startDate: { lte: Date }; endDate: { gte: Date } }> } = { vehicleId: params.id };

    // Optional: filter by month for performance
    if (year && month) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
        return NextResponse.json(
          { error: "Invalid year or month" },
          { status: 400 }
        );
      }
      const monthStart = new Date(y, m - 1, 1);
      const monthEnd = new Date(y, m, 0, 23, 59, 59);

      where = {
        vehicleId: params.id,
        OR: [
          {
            startDate: { lte: monthEnd },
            endDate: { gte: monthStart },
          },
        ],
      };
    }

    const blockedDates = await prisma.blockedDate.findMany({
      where,
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({
      vehicleId: params.id,
      blockedDates: blockedDates.map((bd) => ({
        id: bd.id,
        startDate: bd.startDate.toISOString().split("T")[0],
        endDate: bd.endDate.toISOString().split("T")[0],
        source: bd.source,
        summary: bd.summary,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch blocked dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocked dates" },
      { status: 500 }
    );
  }
}
