import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  company: [
    { href: "/", label: "Home" },
    { href: "/vehicles", label: "Our Fleet" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ],
  fleet: [
    { href: "/vehicles?category=Sports+Car", label: "Sports Cars" },
    { href: "/vehicles?category=Luxury+SUV", label: "Luxury SUVs" },
    { href: "/vehicles?category=Convertible", label: "Convertibles" },
    { href: "/vehicles?category=Exotic", label: "Exotic Cars" },
  ],
  support: [
    { href: "/faq", label: "FAQs" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Us" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-ink border-t border-ink-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex flex-col leading-none mb-6">
              <span className="text-[15px] font-semibold tracking-[0.22em] text-apple-black">
                CAR RENTAL
              </span>
              <span className="flex items-center gap-2 mt-1">
                <span className="h-px w-4 bg-gold/60" />
                <span className="text-[10px] tracking-[0.4em] text-gold">MIAMI</span>
                <span className="h-px w-4 bg-gold/60" />
              </span>
            </div>
            <p className="text-apple-gray text-[14px] leading-relaxed max-w-sm mb-6">
              We don&apos;t rent cars. We hand out the keys to Miami. Premium luxury car
              rentals with concierge-level service.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+15619476388"
                className="flex items-center gap-3 text-[14px] text-apple-gray hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>(561) 947-6388</span>
              </a>
              <a
                href="tel:+13213177884"
                className="flex items-center gap-3 text-[14px] text-apple-gray hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>(321) 317-7884</span>
              </a>
              <a
                href="mailto:hello@zcarrentalmia.com"
                className="flex items-center gap-3 text-[14px] text-apple-gray hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-gold" />
                <span>hello@zcarrentalmia.com</span>
              </a>
              <div className="flex items-center gap-3 text-[14px] text-apple-gray">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Miami, Florida</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-apple-black mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-apple-gray hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fleet */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-apple-black mb-4">
              Fleet
            </h4>
            <ul className="space-y-3">
              {footerLinks.fleet.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-apple-gray hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-apple-black mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-apple-gray hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-ink-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-apple-gray">
            &copy; {new Date().getFullYear()} Z Car Rental Miami. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/zcarrentalmiami"
              target="_blank"
              rel="noopener noreferrer"
              className="text-apple-gray hover:text-gold transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
