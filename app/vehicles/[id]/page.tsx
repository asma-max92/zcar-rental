import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import VehicleDetailContent from "./vehicle-detail-content";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      select: { make: true, model: true, category: true, description: true, dailyRate: true, imageUrl: true },
    });

    if (!vehicle) {
      return { title: "Vehicle Not Found | Z Car Rental Miami" };
    }

    const title = `Rent ${vehicle.make} ${vehicle.model} in Miami | Z Car Rental`;
    const description = vehicle.description || `Rent a ${vehicle.make} ${vehicle.model} (${vehicle.category}) in Miami. Premium luxury car rental with concierge service. Starting at $${(vehicle.dailyRate / 100).toFixed(0)}/day.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://zcarrentalmiami.com/vehicles/${params.id}`,
        images: vehicle.imageUrl ? [{ url: vehicle.imageUrl, alt: `${vehicle.make} ${vehicle.model}` }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: vehicle.imageUrl ? [vehicle.imageUrl] : undefined,
      },
      alternates: {
        canonical: `https://zcarrentalmiami.com/vehicles/${params.id}`,
      },
    };
  } catch {
    return { title: "Vehicle | Z Car Rental Miami" };
  }
}

export default async function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [vehicle, reviews] = await Promise.all([
    prisma.vehicle.findUnique({
      where: { id: params.id },
    }),
    prisma.review.findMany({
      where: { vehicleId: params.id, approved: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!vehicle) {
    notFound();
  }

  return (
    <VehicleDetailContent
      vehicle={vehicle}
      reviews={reviews}
    />
  );
}
