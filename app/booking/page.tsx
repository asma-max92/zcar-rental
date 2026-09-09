"use client";

import { Suspense } from "react";
import BookingContent from "./booking-content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <Suspense fallback={<BookingSkeleton />}>
        <BookingContent />
      </Suspense>
      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}

function BookingSkeleton() {
  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-ink-card rounded w-1/3 mb-4" />
          <div className="h-4 bg-ink-card rounded w-1/2 mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[600px] bg-ink-card rounded-2xl" />
            <div className="h-[400px] bg-ink-card rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
