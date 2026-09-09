"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
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
              <Shield className="w-4 h-4" />
              Privacy
            </div>
            <h1 className="font-display font-semibold text-[36px] sm:text-[46px] tracking-tight text-apple-black">
              Privacy Policy
            </h1>
            <p className="text-apple-gray text-[16px] mt-4">
              Last updated: September 2026
            </p>
          </motion.div>

          <div className="prose prose-invert max-w-none text-[14px] text-apple-gray leading-relaxed space-y-8">
            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Introduction</h2>
              <p>
                Z Car Rental Miami LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed
                to protecting your personal data. This Privacy Policy explains how we collect, use,
                store, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Information We Collect</h2>
              <p className="mb-2">We collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, driver&apos;s license details, date of birth</li>
                <li><strong>Payment Information:</strong> Credit card details (processed securely via Stripe — we do not store full card numbers)</li>
                <li><strong>Rental Information:</strong> Pickup/drop-off locations, dates, vehicle preferences, mileage</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies</li>
                <li><strong>Communication Data:</strong> Emails, chat messages, phone call records</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Process and confirm your reservations</li>
                <li>Communicate booking details and updates</li>
                <li>Process payments and security deposits</li>
                <li>Verify identity and driving eligibility</li>
                <li>Provide customer support</li>
                <li>Send promotional offers (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Data Storage & Security</h2>
              <p>
                Your data is stored on secure servers with industry-standard encryption. Payment processing
                is handled by Stripe, a PCI-DSS compliant payment processor. We implement appropriate
                technical and organizational measures to protect your data against unauthorized access,
                alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Third-Party Sharing</h2>
              <p className="mb-2">We may share your data with:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Payment processors</strong> (Stripe) to process transactions</li>
                <li><strong>Insurance providers</strong> when coverage is purchased</li>
                <li><strong>Law enforcement</strong> when required by law or to prevent fraud</li>
                <li><strong>Service providers</strong> who assist in our operations (under strict confidentiality agreements)</li>
              </ul>
              <p className="mt-2">
                We do not sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Cookies & Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your browsing experience, analyze
                website traffic, and personalize content. You can manage cookie preferences through
                your browser settings. Essential cookies necessary for website functionality cannot be disabled.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Your Rights</h2>
              <p className="mb-2">Under applicable privacy laws, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (subject to legal retention requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data in a portable format</li>
                <li>Lodge a complaint with a data protection authority</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes
                outlined in this policy, unless a longer retention period is required by law. Rental
                records are retained for 7 years for tax and legal compliance.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Children&apos;s Privacy</h2>
              <p>
                Our services are not directed to individuals under 18. We do not knowingly collect
                personal information from children. If you believe we have inadvertently collected
                such data, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this
                page with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-semibold text-apple-black mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <p className="mt-2">
                Z Car Rental Miami LLC<br />
                Email: support@zcarrentalmiami.com<br />
                Phone: (561) 947-6388<br />
                Address: Miami, FL
              </p>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
