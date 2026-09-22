import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET blocked dates for a vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const blockedDates = await prisma.blockedDate.findMany({
      where: { vehicleId: params.id },
      orderBy: { startDate: "asc" },
    });
    return NextResponse.json(blockedDates);
  } catch (error) {
    console.error("Get blocked dates error:", error);
    return NextResponse.json(
      { error: "Failed to load blocked dates" },
      { status: 500 }
    );
  }
}

// POST add blocked date
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (startDate > endDate) {
      return NextResponse.json(
        { error: "startDate must be before or equal to endDate" },
        { status: 400 }
      );
    }

    const blockedDate = await prisma.blockedDate.create({
      data: {
        vehicleId: params.id,
        startDate,
        endDate,
        source: "manual",
        summary: body.summary || "Unavailable",
      },
    });
    return NextResponse.json(blockedDate);
  } catch (error) {
    console.error("Add blocked date error:", error);
    return NextResponse.json(
      { error: "Failed to add blocked date" },
      { status: 500 }
    );
  }
}
