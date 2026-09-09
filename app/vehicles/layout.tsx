import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Fleet | Luxury & Exotic Cars",
  description:
    "Browse our curated fleet of luxury SUVs, sports cars, convertibles, and exotic vehicles. All available for rental in Miami with airport delivery.",
  openGraph: {
    title: "Our Fleet | Luxury & Exotic Cars",
    description:
      "Browse our curated fleet of luxury SUVs, sports cars, convertibles, and exotic vehicles. All available for rental in Miami with airport delivery.",
    url: "https://zcarrentalmiami.com/vehicles",
  },
  alternates: {
    canonical: "https://zcarrentalmiami.com/vehicles",
  },
};

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
