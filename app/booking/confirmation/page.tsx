"use client";

import Link from "next/link";
import { Check, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function BookingConfirmationPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />

      <section className="pt-32 pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-gold" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="font-display font-semibold text-[36px] sm:text-[46px] tracking-tight text-apple-black mb-4">
              Request Received
            </h1>
            <p className="text-apple-gray text-[16px] leading-relaxed mb-8">
              Thank you for your booking request. Our concierge team will review
              your reservation and contact you within 15 minutes to confirm
              availability and arrange payment.
            </p>

            <div className="bg-ink-card border border-ink-border rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-gold" />
                <span className="font-semibold text-apple-black">What happens next?</span>
              </div>
              <ol className="space-y-3 text-[14px] text-apple-gray">
                <li className="flex gap-3">
                  <span className="text-gold font-semibold">1.</span>
                  Our team checks vehicle availability for your dates.
                </li>
                <li className="flex gap-3">
                  <span className="text-gold font-semibold">2.</span>
                  You&apos;ll receive a confirmation call or email within 15 minutes.
                </li>
                <li className="flex gap-3">
                  <span className="text-gold font-semibold">3.</span>
                  A secure payment link will be sent to complete your reservation.
                </li>
                <li className="flex gap-3">
                  <span className="text-gold font-semibold">4.</span>
                  Your vehicle will be delivered to your specified location.
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center gap-2 bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-8 py-4 rounded-lg hover:bg-gold-light transition-colors"
              >
                Browse More Vehicles
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/15619476388"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-gold/50 text-gold text-[12px] font-semibold uppercase tracking-[0.12em] px-8 py-4 rounded-lg hover:bg-gold/10 transition-colors"
              >
                Chat with Concierge
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}
