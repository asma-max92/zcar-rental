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
    const blockedDate = await prisma.blockedDate.create({
      data: {
        vehicleId: params.id,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
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
