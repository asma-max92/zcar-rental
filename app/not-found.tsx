import Link from "next/link";
import { Car, ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Car className="w-10 h-10 text-gold" />
        </div>
        <h1 className="font-display font-semibold text-[72px] tracking-tight text-gold mb-2">
          404
        </h1>
        <h2 className="font-display font-semibold text-[24px] text-apple-black mb-4">
          Page Not Found
        </h2>
        <p className="text-apple-gray text-[16px] leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/vehicles"
            className="inline-flex items-center justify-center gap-2 border border-gold/50 text-gold text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-3 rounded-lg hover:bg-gold/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Fleet
          </Link>
        </div>
      </div>
    </main>
  );
}
