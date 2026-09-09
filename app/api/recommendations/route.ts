import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, location } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const recommendation = await prisma.recommendationRequest.create({
      data: {
        name: name || "",
        phone,
        location: location || "",
      },
    });

    return NextResponse.json(
      { success: true, id: recommendation.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Recommendation request error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
