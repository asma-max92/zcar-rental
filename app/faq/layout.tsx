import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about renting luxury cars in Miami. Age requirements, insurance, delivery, cancellation, and more.",
  openGraph: {
    title: "FAQ | Z Car Rental Miami",
    description:
      "Frequently asked questions about renting luxury cars in Miami. Age requirements, insurance, delivery, cancellation, and more.",
    url: "https://zcarrentalmiami.com/faq",
  },
  alternates: {
    canonical: "https://zcarrentalmiami.com/faq",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
