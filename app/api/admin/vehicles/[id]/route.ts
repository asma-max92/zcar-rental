import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        ...(body.make !== undefined && { make: body.make }),
        ...(body.model !== undefined && { model: body.model }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.dailyRate !== undefined && { dailyRate: Number(body.dailyRate) }),
        ...(body.seats !== undefined && { seats: Number(body.seats) }),
        ...(body.transmission !== undefined && { transmission: body.transmission }),
        ...(body.horsepower !== undefined && { horsepower: Number(body.horsepower) }),
        ...(body.topSpeed !== undefined && { topSpeed: body.topSpeed }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.featured !== undefined && { featured: body.featured === true }),
        ...(body.available !== undefined && { available: body.available === true }),
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Update vehicle error:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await prisma.vehicle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
