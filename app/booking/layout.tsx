import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Rental",
  description:
    "Book your luxury car rental in Miami. Choose your dates, add insurance, and reserve your vehicle in minutes.",
  openGraph: {
    title: "Book Your Rental | Z Car Rental Miami",
    description:
      "Book your luxury car rental in Miami. Choose your dates, add insurance, and reserve your vehicle in minutes.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
