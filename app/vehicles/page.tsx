import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { JsonLd, vehicleListSchema } from "@/components/json-ld";
import VehiclesContent from "./vehicles-content";

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    where: { available: true },
    orderBy: { featured: "desc" },
  });

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />

      <section className="pt-32 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.2em]">Our Collection</span>
            <h1 className="font-display font-semibold text-[46px] sm:text-[52px] tracking-tight text-apple-black mt-3">The Fleet</h1>
            <p className="text-apple-gray text-[16px] max-w-xl mt-4">Handpicked luxury vehicles, each one a statement on Miami streets.</p>
          </div>
        </div>
      </section>

      <JsonLd data={vehicleListSchema(vehicles)} id="json-ld-vehicles" />
      <VehiclesContent vehicles={vehicles} />

      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}
