"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd, faqPageSchema } from "@/components/json-ld";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is the minimum age to rent a vehicle?",
    answer:
      "You must be at least 25 years old with a valid driver's license and a major credit card in your name. Drivers aged 21-24 may rent with an additional young driver fee of $35/day.",
  },
  {
    question: "What documents do I need to bring?",
    answer:
      "A valid driver's license (international licenses accepted), a major credit card for the security deposit, and proof of insurance if you decline our coverage. A passport or government-issued ID may be required for verification.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made 48 hours or more before the rental start time receive a full refund. Cancellations within 24-48 hours receive a 50% refund. Same-day cancellations are non-refundable but may be rescheduled subject to availability.",
  },
  {
    question: "Is insurance included in the rental price?",
    answer:
      "Basic liability and collision coverage is included with a $2,500 deductible. We offer Premium Coverage ($35/day, $500 deductible) and Full Coverage ($65/day, zero deductible) for peace of mind. Your personal auto insurance may also cover rentals.",
  },
  {
    question: "Can I add an additional driver?",
    answer:
      "Yes, you can add up to 2 additional authorized drivers for $25/day each. All additional drivers must meet the same age and licensing requirements and be present at pickup with their valid driver's license.",
  },
  {
    question: "Do you offer airport pickup and delivery?",
    answer:
      "Yes, we offer delivery to Miami International Airport (MIA), Fort Lauderdale Airport (FLL), and most hotels in Miami Beach and Downtown Miami. Airport delivery is $75, hotel delivery is $50. Pickup at our Miami location is always free.",
  },
  {
    question: "What is your fuel policy?",
    answer:
      "All vehicles are provided with a full tank of fuel. You can return the vehicle with a full tank, or we can refuel it for you at the current market rate plus a $15 convenience fee. Premium fuel is required for all luxury and exotic vehicles.",
  },
  {
    question: "Are there mileage limits?",
    answer:
      "Our rentals include 150 miles per day. Additional miles are charged at $2.50 per mile for luxury vehicles and $5.00 per mile for exotic vehicles. Weekly rentals (7+ days) include unlimited mileage.",
  },
  {
    question: "What happens if the vehicle is damaged?",
    answer:
      "In the event of damage, your security deposit will be held pending assessment. With Basic coverage, you are responsible for the deductible ($2,500). With Premium ($500) or Full coverage (zero), your out-of-pocket is reduced accordingly. All incidents must be reported within 24 hours.",
  },
  {
    question: "Can I extend my rental period?",
    answer:
      "Yes, extensions are subject to vehicle availability. Contact us at least 24 hours before your scheduled return. Extensions are charged at the original daily rate. Last-minute extensions may incur a $50 convenience fee.",
  },
  {
    question: "Do you offer child or baby seats?",
    answer:
      "Yes, we offer safety-certified child and infant seats for $15/day. Please specify the child's age and weight when booking so we can provide the appropriate seat. Florida law requires children under 5 to be in a car seat.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards with a major logo, and bank transfers for corporate accounts. The security deposit hold ($2,500-$5,000 depending on vehicle) must be placed on a credit card.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-ink">
      <JsonLd data={faqPageSchema(faqs)} id="json-ld-faq" />
      <SiteHeader />

      <section className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-gold text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">
              <HelpCircle className="w-4 h-4" />
              Support
            </div>
            <h1 className="font-display font-semibold text-[36px] sm:text-[46px] tracking-tight text-apple-black">
              Frequently Asked Questions
            </h1>
            <p className="text-apple-gray text-[16px] mt-4 max-w-xl mx-auto">
              Everything you need to know about renting with Z Car Rental Miami.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-ink-card border border-ink-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-ink-light/50 transition-colors"
                >
                  <span className="font-semibold text-apple-black text-[14px] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold shrink-0 transition-transform ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-[14px] text-apple-gray leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-apple-gray text-[14px]">
              Still have questions?{" "}
              <a href="/contact" className="text-gold hover:underline">
                Contact our concierge team
              </a>{" "}
              or call us at{" "}
              <a href="tel:5619476388" className="text-gold hover:underline">
                (561) 947-6388
              </a>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
