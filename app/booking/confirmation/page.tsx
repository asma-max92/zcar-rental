"use client";

import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import ConfirmationContent from "./confirmation-content";

export default function BookingConfirmationPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <Suspense fallback={<ConfirmationFallback />}>
        <ConfirmationContent />
      </Suspense>
      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}

function ConfirmationFallback() {
  return (
    <section className="pt-32 pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse" />
        <h1 className="font-display font-semibold text-[36px] text-apple-black mb-4">
          Loading...
        </h1>
      </div>
    </section>
  );
}
