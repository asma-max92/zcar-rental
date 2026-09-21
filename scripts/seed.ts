import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create or update admin user — only update password when ADMIN_SEED_PASSWORD is explicitly set
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;
  const hashedPassword = adminPassword ? await bcrypt.hash(adminPassword, 10) : undefined;

  const existingUser = await prisma.user.findUnique({ where: { email: "john@doe.com" } });

  if (existingUser) {
    if (hashedPassword) {
      await prisma.user.update({
        where: { email: "john@doe.com" },
        data: { password: hashedPassword },
      });
      console.log("Admin password updated from ADMIN_SEED_PASSWORD.");
    }
  } else {
    const fallbackPassword = adminPassword || require("crypto").randomBytes(16).toString("hex");
    const fallbackHash = await bcrypt.hash(fallbackPassword, 10);
    await prisma.user.create({
      data: {
        email: "john@doe.com",
        password: fallbackHash,
        firstName: "John",
        lastName: "Doe",
        role: "admin",
      },
    });
    console.log(`Admin user created. Password: ${fallbackPassword}`);
  }

  // Seed vehicles — actual Z Car Rental fleet
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
      galleryImages: ["/images/corvette/02.jpg", "/images/corvette/03.jpg"] as string[],
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
      galleryImages: ["/images/porsche-boxster/02.jpg"] as string[],
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
      galleryImages: ["/images/porsche-macan/02.jpg", "/images/porsche-macan/03.jpg", "/images/porsche-macan/04.jpg"] as string[],
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
      galleryImages: ["/images/g550/02.jpg", "/images/g550/03.jpg", "/images/g550/04.jpg"] as string[],
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
      galleryImages: ["/images/mercedes-cle/02.jpg", "/images/mercedes-cle/03.jpg"] as string[],
      seats: 4,
      transmission: "Automatic",
      horsepower: 312,
      topSpeed: "155 mph",
      featured: true,
      available: true,
    },
  ];

  // Clear existing vehicles and re-seed
  // Delete bookings first to avoid foreign-key violations
  await prisma.booking.deleteMany({});
  await prisma.vehicle.deleteMany({});

  for (const vehicle of vehicles) {
    await prisma.vehicle.create({ data: vehicle });
  }

  console.log(`Seeded ${vehicles.length} vehicles with correct colors and years.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
