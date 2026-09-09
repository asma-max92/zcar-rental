"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ink">
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
              <FileText className="w-4 h-4" />
              Legal
            </div>
            <h1 className="font-display font-semibold text-[36px] sm:text-[46px] tracking-tight text-apple-black">
              Terms & Conditions
            </h1>
            <p className="text-apple-gray text-[16px] mt-4">
              Last updated: September 2026
            </p>
          </motion.div>

          <div className="prose prose-invert max-w-none text-[14px] text-apple-gray leading-relaxed space-y-8">
            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">1. Rental Agreement</h2>
              <p>
                By renting a vehicle from Z Car Rental Miami, you agree to these Terms & Conditions.
                This agreement constitutes a legally binding contract between you (the &ldquo;Renter&rdquo;) and
                Z Car Rental Miami LLC (the &ldquo;Company&rdquo;).
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">2. Eligibility Requirements</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Minimum age: 25 years old (21-24 with young driver fee)</li>
                <li>Valid driver&apos;s license held for at least 2 years</li>
                <li>Major credit card in the renter&apos;s name</li>
                <li>Proof of personal auto insurance (if declining Company coverage)</li>
                <li>Clean driving record (no DUI, reckless driving, or major violations within 3 years)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">3. Reservation & Payment</h2>
              <p>
                A reservation is confirmed upon receipt of a deposit equal to one day&apos;s rental fee.
                The full rental amount plus a security deposit ($2,500-$5,000 depending on vehicle class)
                is due at pickup. We accept major credit cards and debit cards. Cash payments are not accepted.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">4. Cancellation Policy</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>48+ hours before pickup: Full refund</li>
                <li>24-48 hours before pickup: 50% refund</li>
                <li>Less than 24 hours: No refund (rescheduling subject to availability)</li>
                <li>No-shows: Full rental charge applied</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">5. Insurance & Liability</h2>
              <p>
                Basic coverage is included with all rentals. The Renter is responsible for the deductible
                amount ($2,500 for Basic, $500 for Premium, $0 for Full Coverage) in the event of damage,
                theft, or loss. The Renter is fully liable for any damage caused by reckless driving,
                driving under the influence, or violation of traffic laws.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">6. Vehicle Use Restrictions</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>No smoking in any vehicle ($500 cleaning fee)</li>
                <li>No off-road driving or racing</li>
                <li>No towing or transporting hazardous materials</li>
                <li>Vehicle may not leave the state of Florida without prior written approval</li>
                <li>Only authorized drivers may operate the vehicle</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">7. Fuel Policy</h2>
              <p>
                Vehicles are provided with a full tank of premium fuel. The Renter may return the vehicle
                with a full tank or opt for our refueling service at current market rates plus a $15 convenience fee.
                Failure to refuel will result in charges at $8.00 per gallon.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">8. Mileage</h2>
              <p>
                Daily rentals include 150 miles per day. Weekly rentals (7+ days) include unlimited mileage.
                Excess mileage is charged at $2.50/mile for luxury vehicles and $5.00/mile for exotic vehicles.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">9. Security Deposit</h2>
              <p>
                A security deposit hold will be placed on your credit card at pickup. The hold is released
                within 3-5 business days after return, pending inspection. Damage, traffic violations, tolls,
                or fuel charges will be deducted from the deposit.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">10. Governing Law</h2>
              <p>
                These Terms & Conditions are governed by the laws of the State of Florida. Any disputes
                shall be resolved in the courts of Miami-Dade County, Florida.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Contact</h2>
              <p>
                Z Car Rental Miami LLC<br />
                Miami, FL<br />
                Phone: (561) 947-6388<br />
                Email: support@zcarrentalmiami.com
              </p>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
