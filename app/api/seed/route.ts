import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.SEED_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "SEED_SECRET not configured" },
      { status: 500 }
    );
  }

  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(authHeader || "");
  if (
    actual.length !== expected.length ||
    !crypto.timingSafeEqual(actual, expected)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create admin user if not exists — generate random password
    const existingUser = await prisma.user.findUnique({
      where: { email: "john@doe.com" },
    });

    let adminPassword: string | null = null;
    if (!existingUser) {
      adminPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: "john@doe.com",
          password: hashedPassword,
          firstName: "John",
          lastName: "Doe",
          role: "admin",
        },
      });
    }

    // Seed vehicles
    const vehicles = [
      {
        make: "Chevrolet",
        model: "Corvette 2024",
        category: "Sports Car",
        tagline: "RED AMERICAN SUPERCAR. UNMATCHED THRILL.",
        description:
          "The red 2024 Chevrolet Corvette C8 delivers American supercar performance at its finest. Mid-engine precision and breathtaking speed for the ultimate Miami thrill.",
        dailyRate: 34900,
        imageUrl: "/images/corvette/01.jpg",
        galleryImages: ["/images/corvette/02.jpg", "/images/corvette/03.jpg"],
        seats: 2,
        transmission: "Automatic",
        horsepower: 490,
        topSpeed: "194 mph",
        featured: true,
        available: true,
      },
      {
        make: "Porsche",
        model: "Boxster 2024",
        category: "Convertible",
        tagline: "GREY OPEN-AIR THRILL. PURE PORSCHE SOUL.",
        description:
          "The grey 2024 Porsche Boxster brings mid-engine balance and open-air freedom together in perfect harmony. Drop the top, feel the Miami breeze, and experience driving as it was meant to be.",
        dailyRate: 32900,
        imageUrl: "/images/porsche-boxster/01.jpg",
        galleryImages: ["/images/porsche-boxster/02.jpg"],
        seats: 2,
        transmission: "Automatic",
        horsepower: 350,
        topSpeed: "177 mph",
        featured: true,
        available: true,
      },
      {
        make: "Porsche",
        model: "Macan",
        category: "Luxury SUV",
        tagline: "NAVY BLUE SPORTINESS. UNMISTAKABLY PORSCHE.",
        description:
          "The navy blue Porsche Macan delivers thrilling performance wrapped in everyday practicality. Turbocharged power, precision handling, and a cabin crafted for those who refuse to compromise.",
        dailyRate: 34900,
        imageUrl: "/images/porsche-macan/01.jpg",
        galleryImages: ["/images/porsche-macan/02.jpg", "/images/porsche-macan/03.jpg", "/images/porsche-macan/04.jpg"],
        seats: 5,
        transmission: "Automatic",
        horsepower: 375,
        topSpeed: "160 mph",
        featured: true,
        available: true,
      },
      {
        make: "Mercedes",
        model: "G 550",
        category: "Luxury SUV",
        tagline: "BLACK ICON. UNSTOPPABLE. TIMELESS.",
        description:
          "The black Mercedes G 550 is a legend reborn. Boxy silhouette, hand-built craftsmanship, and a thunderous V8 that commands every road in Miami. Nothing else says you've arrived quite like the G-Wagon.",
        dailyRate: 44900,
        imageUrl: "/images/g550/01.jpg",
        galleryImages: ["/images/g550/02.jpg", "/images/g550/03.jpg", "/images/g550/04.jpg"],
        seats: 5,
        transmission: "Automatic",
        horsepower: 416,
        topSpeed: "130 mph",
        featured: true,
        available: true,
      },
      {
        make: "Mercedes",
        model: "CLE 2024",
        category: "Convertible",
        tagline: "BLUE ELEGANCE. OPEN-AIR LUXURY.",
        description:
          "The blue 2024 Mercedes CLE redefines open-top luxury. Sophisticated design, advanced technology, and a silky-smooth ride make every Miami sunset drive unforgettable.",
        dailyRate: 27900,
        imageUrl: "/images/mercedes-cle/01.jpg",
        galleryImages: ["/images/mercedes-cle/02.jpg", "/images/mercedes-cle/03.jpg"],
        seats: 4,
        transmission: "Automatic",
        horsepower: 312,
        topSpeed: "155 mph",
        featured: true,
        available: true,
      },
    ];

    await prisma.$transaction([
      prisma.booking.deleteMany(),
      prisma.vehicle.deleteMany(),
      ...vehicles.map((vehicle) => prisma.vehicle.create({ data: vehicle })),
    ]);

    return NextResponse.json({
      success: true,
      message: `Seeded ${vehicles.length} vehicles${adminPassword ? ` and admin user (password: ${adminPassword})` : ""}.`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
