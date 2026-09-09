import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Concierge delivery, airport pickup, insurance options, and 24/7 support. Experience premium car rental service in Miami.",
  openGraph: {
    title: "Services | Z Car Rental Miami",
    description:
      "Concierge delivery, airport pickup, insurance options, and 24/7 support. Experience premium car rental service in Miami.",
    url: "https://zcarrentalmiami.com/services",
  },
  alternates: {
    canonical: "https://zcarrentalmiami.com/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
