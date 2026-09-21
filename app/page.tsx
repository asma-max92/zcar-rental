import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { HomeContent } from "./_components/home-content";

export const metadata: Metadata = {
  title: "Luxury Car Rentals Miami | Exotic & Sports Cars",
  description:
    "Rent luxury and exotic cars in Miami. Porsche, BMW, Mercedes, Corvette and more. Airport delivery, concierge service, instant booking.",
  openGraph: {
    title: "Luxury Car Rentals Miami | Exotic & Sports Cars",
    description:
      "Rent luxury and exotic cars in Miami. Porsche, BMW, Mercedes, Corvette and more. Airport delivery, concierge service, instant booking.",
    url: "https://zcarrentalmiami.com",
  },
  alternates: {
    canonical: "https://zcarrentalmiami.com",
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  let featuredVehicles: { id: string; make: string; model: string; category: string; dailyRate: number; imageUrl: string; seats: number; transmission: string }[] = [];
  try {
    featuredVehicles = await prisma.vehicle.findMany({
      where: { featured: true, available: true },
      orderBy: { dailyRate: "desc" },
      select: { id: true, make: true, model: true, category: true, dailyRate: true, imageUrl: true, seats: true, transmission: true },
    });
  } catch {
    // DB unreachable — empty state handled by component
  }

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <HomeContent featuredVehicles={featuredVehicles} />
      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}
