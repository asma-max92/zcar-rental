import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { JsonLd, organizationSchema, localBusinessSchema } from "@/components/json-ld";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zcarrentalmiami.com"),
  title: {
    default: "Z Car Rental Miami | Luxury Car Rentals",
    template: "%s | Z Car Rental Miami",
  },
  description:
    "Premium luxury car rentals in Miami. Drive Miami differently with our curated fleet of exotic and luxury vehicles.",
  keywords: [
    "luxury car rental Miami",
    "exotic car rental",
    "sports car rental",
    "Miami car rental",
    "luxury SUV rental",
    "Porsche rental Miami",
    "BMW rental Miami",
    "Mercedes rental Miami",
  ],
  authors: [{ name: "Z Car Rental Miami" }],
  creator: "Z Car Rental Miami",
  publisher: "Z Car Rental Miami",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zcarrentalmiami.com",
    siteName: "Z Car Rental Miami",
    title: "Z Car Rental Miami | Luxury Car Rentals",
    description:
      "Premium luxury car rentals in Miami. Drive Miami differently with our curated fleet of exotic and luxury vehicles.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Z Car Rental Miami - Luxury Fleet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Z Car Rental Miami | Luxury Car Rentals",
    description:
      "Premium luxury car rentals in Miami. Drive Miami differently with our curated fleet of exotic and luxury vehicles.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${poppins.variable} font-sans antialiased bg-ink text-apple-black`}
      >
        <JsonLd data={organizationSchema} id="json-ld-org" />
        <JsonLd data={localBusinessSchema} id="json-ld-local" />
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1A1A1A",
                  border: "1px solid #262626",
                  color: "#F5F1E8",
                },
              }}
            />
            <CookieConsent />
        </ThemeProvider>
      </Providers>
    </body>
  </html>
  );
}
