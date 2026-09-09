import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      make,
      model,
      category,
      dailyRate,
      seats,
      transmission,
      horsepower,
      topSpeed,
      description,
      imageUrl,
      featured,
      available,
    } = body;

    if (!make || !model || !category || !dailyRate || !Number.isFinite(Number(dailyRate)) || Number(dailyRate) <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        category,
        dailyRate: Number(dailyRate),
        seats: seats ? Number(seats) : 4,
        transmission: transmission || "Automatic",
        horsepower: horsepower ? Number(horsepower) : 0,
        topSpeed: topSpeed || "",
        description: description || "",
        imageUrl: imageUrl || "",
        featured: featured === true,
        available: available !== false,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Create vehicle error:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
