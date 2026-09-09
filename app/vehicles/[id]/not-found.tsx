import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function VehicleNotFound() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <div className="pt-32 pb-20 text-center">
        <h1 className="font-display font-semibold text-[36px] text-apple-black mb-4">
          Vehicle Not Found
        </h1>
        <p className="text-apple-gray text-[16px] mb-8">
          The vehicle you are looking for does not exist or is no longer available.
        </p>
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
        >
          Browse Fleet
        </Link>
      </div>
      <SiteFooter />
    </main>
  );
}
