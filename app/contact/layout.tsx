import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Z Car Rental Miami. Call, WhatsApp, or email our concierge team for bookings, questions, or special requests.",
  openGraph: {
    title: "Contact Us | Z Car Rental Miami",
    description:
      "Get in touch with Z Car Rental Miami. Call, WhatsApp, or email our concierge team.",
    url: "https://zcarrentalmiami.com/contact",
  },
  alternates: {
    canonical: "https://zcarrentalmiami.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
