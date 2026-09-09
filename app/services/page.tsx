"use client";

import { motion } from "framer-motion";
import {
  Car,
  Shield,
  Clock,
  Star,
  Phone,
  Wrench,
  Sparkles,
  Headphones,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import Link from "next/link";

const services = [
  {
    icon: Car,
    title: "Doorstep Delivery",
    description:
      "We deliver your chosen vehicle directly to your location — Miami Airport, South Beach hotel, Brickell residence, or any address in the Miami area. Your car arrives clean, fueled, and ready to drive.",
    features: ["Airport pickup & drop-off", "Hotel delivery", "Residential service", "Flexible timing"],
  },
  {
    icon: Shield,
    title: "Full Insurance Coverage",
    description:
      "Every rental includes comprehensive insurance coverage so you can drive with total peace of mind. We handle the details so you can focus on enjoying the drive.",
    features: ["Comprehensive coverage", "Damage protection", "Theft protection", "24/7 claims support"],
  },
  {
    icon: Clock,
    title: "24/7 Concierge Support",
    description:
      "Our dedicated concierge team is available around the clock to assist with any request — from roadside assistance to restaurant reservations and event recommendations.",
    features: ["Round-the-clock availability", "Roadside assistance", "Local recommendations", "Emergency support"],
  },
  {
    icon: Sparkles,
    title: "White-Glove Service",
    description:
      "From the moment you book to the moment you return, experience service that exceeds expectations. Immaculately maintained vehicles and attention to every detail.",
    features: ["Immaculate detailing", "Premium amenities", "Personalized experience", "Key handover ritual"],
  },
  {
    icon: Wrench,
    title: "Flexible Rental Terms",
    description:
      "Whether you need a car for a day, a week, or a month, we offer flexible rental periods with competitive rates. Long-term rentals enjoy special pricing.",
    features: ["Daily rentals", "Weekly discounts", "Monthly rates", "Custom durations"],
  },
  {
    icon: Headphones,
    title: "Personal Concierge",
    description:
      "Beyond the car, we curate your entire Miami experience. Need a dinner reservation at a rooftop restaurant? Tickets to a sold-out event? We make it happen.",
    features: ["Restaurant reservations", "Event access", "Yacht charters", "Private club introductions"],
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />

      {/* Page Header */}
      <section className="pt-32 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.2em]">
              What We Offer
            </span>
            <h1 className="font-display font-semibold text-[46px] sm:text-[52px] tracking-tight text-apple-black mt-3">
              Our Services
            </h1>
            <p className="text-apple-gray text-[16px] max-w-xl mt-4">
              More than a rental — a complete Miami lifestyle experience curated just for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <FadeIn key={service.title} delay={i * 0.1}>
                <div className="bg-ink-card border border-ink-border rounded-2xl p-8 h-full hover:border-gold/20 transition-colors">
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="font-display font-semibold text-[20px] text-apple-black mb-3">
                    {service.title}
                  </h3>
                  <p className="text-apple-gray text-[14px] leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-[13px] text-apple-gray">
                        <Star className="w-3.5 h-3.5 text-gold" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ink-light border-y border-ink-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display font-semibold text-[32px] sm:text-[40px] tracking-tight text-apple-black mb-4">
              Ready to Experience Miami?
            </h2>
            <p className="text-apple-gray text-[16px] max-w-lg mx-auto mb-8">
              Browse our curated fleet and book your perfect Miami ride in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-8 py-4 rounded-lg hover:bg-gold-light transition-colors"
              >
                Browse Fleet
              </Link>
              <a
                href="tel:+15619476388"
                className="inline-flex items-center gap-2 border border-gold/50 text-gold text-[12px] font-semibold uppercase tracking-[0.12em] px-8 py-4 rounded-lg hover:bg-gold/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Concierge
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}
