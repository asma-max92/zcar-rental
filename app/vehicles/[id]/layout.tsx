import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      select: { make: true, model: true, category: true, description: true, imageUrl: true },
    });

    if (!vehicle) {
      return {
        title: "Vehicle Not Found",
        robots: { index: false, follow: false },
      };
    }

    const vehicleName = `${vehicle.make} ${vehicle.model}`;
    const description =
      vehicle.description ||
      `Rent the ${vehicleName} in Miami. Premium ${vehicle.category} with concierge delivery and 24/7 support.`;

    return {
      title: `${vehicleName} | ${vehicle.category} Rental`,
      description,
      openGraph: {
        title: `${vehicleName} | ${vehicle.category} Rental | Z Car Rental Miami`,
        description,
        url: `https://zcarrentalmiami.com/vehicles/${params.id}`,
        images: vehicle.imageUrl
          ? [
              {
                url: vehicle.imageUrl.startsWith("http")
                  ? vehicle.imageUrl
                  : `https://zcarrentalmiami.com${vehicle.imageUrl}`,
                alt: `${vehicleName} - Z Car Rental Miami`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${vehicleName} | ${vehicle.category} Rental | Z Car Rental Miami`,
        description,
        images: vehicle.imageUrl
          ? [
              vehicle.imageUrl.startsWith("http")
                ? vehicle.imageUrl
                : `https://zcarrentalmiami.com${vehicle.imageUrl}`,
            ]
          : undefined,
      },
      alternates: {
        canonical: `https://zcarrentalmiami.com/vehicles/${params.id}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: "Vehicle | Z Car Rental Miami",
      description: "Rent luxury and exotic cars in Miami.",
      robots: { index: true, follow: true },
    };
  }
}

export default function VehicleDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
