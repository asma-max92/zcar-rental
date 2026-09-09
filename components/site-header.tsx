"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, User, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Fleet" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/80 backdrop-blur-xl border-b border-ink-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] sm:text-[15px] font-semibold tracking-[0.18em] text-apple-black whitespace-nowrap">
                CAR RENTAL
              </span>
              <span className="flex items-center gap-1.5 mt-0.5">
                <span className="h-px w-3 bg-gold/60" />
                <span className="text-[9px] tracking-[0.35em] text-gold">MIAMI</span>
                <span className="h-px w-3 bg-gold/60" />
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:!flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium tracking-wide text-apple-gray hover:text-apple-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:!flex items-center gap-4">
            <Link
              href="tel:+15619476388"
              className="flex items-center gap-2 text-[13px] text-gold hover:text-gold-light transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>(561) 947-6388</span>
            </Link>
            {session?.user ? (
              <div className="flex items-center gap-3">
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-[13px] text-gold hover:text-gold-light transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/bookings"
                  className="flex items-center gap-1.5 text-[13px] text-apple-gray hover:text-apple-black transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Bookings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-[12px] text-apple-gray hover:text-gold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/vehicles"
                className="bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-5 py-2.5 rounded-lg hover:bg-gold-light transition-colors"
              >
                Reserve Now
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-apple-black"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ink border-t border-ink-border/50">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-[15px] font-medium text-apple-gray hover:text-apple-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {session?.user ? (
              <>
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block text-[15px] font-medium text-gold hover:text-gold-light transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/bookings"
                  onClick={() => setMobileOpen(false)}
                  className="block text-[15px] font-medium text-apple-gray hover:text-apple-black transition-colors"
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="block w-full text-center text-[12px] text-apple-gray hover:text-gold transition-colors py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/vehicles"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-5 py-3 rounded-lg"
              >
                Reserve Now
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
