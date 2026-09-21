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

  // Seed vehicles — all cars with real images in public/images/
  const vehicles = [
    {
      make: "Mercedes",
      model: "G550",
      category: "Luxury SUV",
      tagline: "ICONIC. UNSTOPPABLE. TIMELESS.",
      description:
        "The Mercedes G550 is a legend reborn. Boxy silhouette, hand-built craftsmanship, and a thunderous V8 that commands every road in Miami. From Ocean Drive to the Everglades, nothing else says you've arrived quite like the G-Wagon.",
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
      make: "Porsche",
      model: "Macan S",
      category: "Luxury SUV",
      tagline: "SPORTY. PRACTICAL. UNMISTAKABLY PORSCHE.",
      description:
        "The Porsche Macan S delivers thrilling performance wrapped in everyday practicality. Turbocharged power, precision handling, and a cabin crafted for those who refuse to compromise.",
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
      make: "Porsche",
      model: "Boxster S",
      category: "Convertible",
      tagline: "OPEN-AIR THRILL. PURE PORSCHE SOUL.",
      description:
        "The Porsche Boxster S brings mid-engine balance and open-air freedom together in perfect harmony. Drop the top, feel the Miami breeze, and experience driving as it was meant to be.",
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
      make: "Mercedes",
      model: "CLE 300 Cabriolet",
      category: "Convertible",
      tagline: "ELEGANCE UNLEASHED. OPEN-AIR LUXURY.",
      description:
        "The Mercedes CLE 300 Cabriolet redefines open-top luxury. Sophisticated design, advanced technology, and a silky-smooth ride make every Miami sunset drive unforgettable.",
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
    {
      make: "Corvette",
      model: "C8",
      category: "Sports Car",
      tagline: "AMERICAN PERFORMANCE. UNMATCHED THRILL.",
      description:
        "The Corvette C8 delivers American supercar performance at its finest. Mid-engine precision and breathtaking speed for the ultimate Miami thrill. With a revolutionary design and track-ready capabilities, the C8 redefines what an American sports car can be.",
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
      make: "BMW",
      model: "M4",
      category: "Sports Car",
      tagline: "PRECISION ENGINEERED. PURE ADRENALINE.",
      description:
        "The BMW M4 is a masterpiece of performance engineering. Twin-turbo power, razor-sharp handling, and an aggressive stance that turns every Miami street into a racetrack.",
      dailyRate: 32900,
      imageUrl: "/images/bmw-m4.png",
      galleryImages: [] as string[],
      seats: 4,
      transmission: "Automatic",
      horsepower: 473,
      topSpeed: "180 mph",
      featured: false,
      available: true,
    },
    {
      make: "BMW",
      model: "M440i Convertible",
      category: "Luxury Convertible",
      tagline: "OPEN-TOP ELEGANCE. DYNAMIC PERFORMANCE.",
      description:
        "The BMW M440i Convertible combines open-air freedom with dynamic performance. Luxurious interior, powerful inline-6 engine, and a retractable hardtop for the perfect Miami drive.",
      dailyRate: 29900,
      imageUrl: "/images/bmw-m440i.png",
      galleryImages: [] as string[],
      seats: 4,
      transmission: "Automatic",
      horsepower: 382,
      topSpeed: "155 mph",
      featured: false,
      available: true,
    },
    {
      make: "BMW",
      model: "X5",
      category: "Luxury SUV",
      tagline: "COMMANDING PRESENCE. REFINED LUXURY.",
      description:
        "The BMW X5 delivers commanding presence with refined luxury. Spacious, powerful, and packed with technology — the perfect companion for family trips or executive travel in Miami.",
      dailyRate: 27900,
      imageUrl: "/images/bmw-x5.png",
      galleryImages: [] as string[],
      seats: 5,
      transmission: "Automatic",
      horsepower: 335,
      topSpeed: "155 mph",
      featured: false,
      available: true,
    },
    {
      make: "Mercedes",
      model: "AMG GT",
      category: "Sports Car",
      tagline: "RACE-BRED SOUL. STREET-LEGAL THRILL.",
      description:
        "The Mercedes-AMG GT is a race-bred supercar with a street-legal soul. Long hood, powerful V8, and a cockpit designed for drivers who demand the extraordinary.",
      dailyRate: 44900,
      imageUrl: "/images/mercedes-amg-gt.png",
      galleryImages: [] as string[],
      seats: 2,
      transmission: "Automatic",
      horsepower: 523,
      topSpeed: "194 mph",
      featured: false,
      available: true,
    },
    {
      make: "Mercedes",
      model: "S-Class",
      category: "Ultra Luxury",
      tagline: "THE BEST OR NOTHING. ULTIMATE REFINEMENT.",
      description:
        "The Mercedes S-Class represents the pinnacle of automotive luxury. Hand-crafted details, cutting-edge technology, and a whisper-quiet cabin for the most discerning Miami clientele.",
      dailyRate: 39900,
      imageUrl: "/images/mercedes-s-class.png",
      galleryImages: [] as string[],
      seats: 5,
      transmission: "Automatic",
      horsepower: 496,
      topSpeed: "155 mph",
      featured: false,
      available: true,
    },
    {
      make: "Porsche",
      model: "911",
      category: "Sports Car",
      tagline: "TIMELESS DESIGN. LEGENDARY PERFORMANCE.",
      description:
        "The Porsche 911 is an icon that needs no introduction. Rear-engine precision, timeless silhouette, and a driving experience that has defined sports cars for generations.",
      dailyRate: 42900,
      imageUrl: "/images/porsche-911.png",
      galleryImages: [] as string[],
      seats: 4,
      transmission: "Automatic",
      horsepower: 443,
      topSpeed: "182 mph",
      featured: false,
      available: true,
    },
    {
      make: "Porsche",
      model: "Cayenne",
      category: "Luxury SUV",
      tagline: "SPORTS CAR DNA. SUV VERSATILITY.",
      description:
        "The Porsche Cayenne brings sports car DNA to the luxury SUV segment. Thrilling performance, premium comfort, and everyday practicality for the Miami lifestyle.",
      dailyRate: 32900,
      imageUrl: "/images/porsche-cayenne.png",
      galleryImages: [] as string[],
      seats: 5,
      transmission: "Automatic",
      horsepower: 348,
      topSpeed: "152 mph",
      featured: false,
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

  console.log(`Seeded ${vehicles.length} vehicles (5 featured, 7 standard) and 1 admin user.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
