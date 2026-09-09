import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import VehicleDetailContent from "./vehicle-detail-content";

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
