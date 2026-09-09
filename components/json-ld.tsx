import Script from "next/script";

export function JsonLd({ data, id }: { data: Record<string, unknown>; id: string }) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Z Car Rental Miami",
  url: "https://zcarrentalmiami.com",
  logo: "https://zcarrentalmiami.com/logo.png",
  sameAs: [
    "https://instagram.com/zcarrentalmiami",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-561-947-6388",
    contactType: "Customer Service",
    areaServed: "US-FL",
    availableLanguage: ["English", "Spanish"],
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Z Car Rental Miami",
  image: "https://zcarrentalmiami.com/og-image.jpg",
  url: "https://zcarrentalmiami.com",
  telephone: "+1-561-947-6388",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Miami",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33101",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.7617,
    longitude: -80.1918,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "22:00",
    },
  ],
  priceRange: "$$$",
};

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function vehicleListSchema(vehicles: { id: string; make: string; model: string; category: string; dailyRate: number; imageUrl: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: vehicles.map((vehicle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Vehicle",
        name: `${vehicle.make} ${vehicle.model}`,
        vehicleType: vehicle.category,
        offers: {
          "@type": "Offer",
          price: (vehicle.dailyRate / 100).toFixed(0),
          priceCurrency: "USD",
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          availability: "https://schema.org/InStock",
        },
        image: vehicle.imageUrl.startsWith("http") ? vehicle.imageUrl : `https://zcarrentalmiami.com${vehicle.imageUrl}`,
        url: `https://zcarrentalmiami.com/vehicles/${vehicle.id}`,
      },
    })),
  };
}
