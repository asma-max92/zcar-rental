"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Car,
  ChevronRight,
  Gauge,
  Users,
  Settings,
  ArrowLeft,
  Star,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { AvailabilityCalendar } from "@/components/availability-calendar";

const vehicleVideos: Record<string, string> = {
  "cmubq0dni0000ncih050a4kzn": "/videos/corvette.mp4",
  "cmubq0dnm0003ncih0n7nmz1a": "/videos/g550.mp4",
  "cmubq0dnn0004ncihj08igha9": "/videos/mercedes-cle.mp4",
};

interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  tagline: string;
  description: string;
  dailyRate: number;
  imageUrl: string;
  galleryImages: string[];
  seats: number;
  transmission: string;
  horsepower: number;
  topSpeed: string;
  featured: boolean;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  createdAt: Date | string;
}

export default function VehicleDetailContent({
  vehicle,
  reviews,
}: {
  vehicle: Vehicle;
  reviews: Review[];
}) {
  const features = [
    { icon: Users, label: `${vehicle.seats} Seats` },
    { icon: Settings, label: vehicle.transmission },
    { icon: Gauge, label: `${vehicle.horsepower} HP` },
    { icon: Car, label: vehicle.topSpeed },
  ];

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 text-[13px] text-apple-gray hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Fleet
          </Link>
        </div>
      </div>

      {/* Vehicle Detail */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-[16/10] bg-ink-light rounded-2xl overflow-hidden border border-ink-border">
                <Image
                  src={vehicle.imageUrl}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {vehicle.galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {vehicle.galleryImages.slice(0, 4).map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square bg-ink-light rounded-xl overflow-hidden border border-ink-border"
                    >
                      <Image src={img} alt="" fill sizes="80px" loading="lazy" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              {vehicleVideos[vehicle.id] && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-ink-border">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full aspect-video object-cover"
                  >
                    <source src={vehicleVideos[vehicle.id]} type="video/mp4" />
                  </video>
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.2em]">
                {vehicle.category}
              </span>
              <h1 className="font-display font-semibold text-[36px] sm:text-[46px] tracking-tight text-apple-black mt-2 mb-2">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-gold text-[13px] font-semibold uppercase tracking-wider mb-6">
                {vehicle.tagline}
              </p>
              <p className="text-apple-gray text-[15px] leading-relaxed mb-8">
                {vehicle.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {features.map((feature) => (
                  <div
                    key={feature.label}
                    className="bg-ink-card border border-ink-border rounded-xl p-4 text-center"
                  >
                    <feature.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="text-[12px] text-apple-gray">{feature.label}</p>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="bg-ink-card border border-ink-border rounded-2xl p-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-gold font-bold text-[36px]">
                    ${(vehicle.dailyRate / 100).toFixed(0)}
                  </span>
                  <span className="text-apple-gray text-[14px]">/ day</span>
                </div>
                <p className="text-apple-gray text-[13px] mb-6">
                  Includes insurance, delivery, and 24/7 concierge support.
                </p>
                <div className="space-y-3">
                  <Link
                    href={`/booking?vehicle=${vehicle.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-4 rounded-lg hover:bg-gold-light transition-colors"
                  >
                    Reserve Now
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://wa.me/15619476388"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 border border-gold/50 text-gold text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-4 rounded-lg hover:bg-gold/10 transition-colors"
                  >
                    Ask Concierge
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Availability Calendar */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AvailabilityCalendar vehicleId={vehicle.id} />
            </div>
            <div className="bg-ink-card border border-ink-border rounded-2xl p-6">
              <h3 className="text-[14px] font-semibold text-apple-black uppercase tracking-wider mb-4">
                Booking Notes
              </h3>
              <ul className="space-y-3 text-[12px] text-apple-gray">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  Red dates are already reserved — either on Turo or through this website.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  Green dates are available for booking.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  Calendar syncs with Turo every 30 minutes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  For same-day bookings, contact us directly via WhatsApp.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-semibold text-[28px] text-apple-black mb-6">
            Customer Reviews
          </h2>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-ink-card border border-ink-border rounded-xl p-5"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-gold fill-gold"
                            : "text-apple-gray/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[14px] text-apple-gray leading-relaxed mb-4">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-apple-black">
                      {review.customerName}
                    </span>
                    <span className="text-[11px] text-apple-gray/60">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-ink-card border border-ink-border rounded-xl p-8 text-center">
              <p className="text-apple-gray text-[14px]">
                No reviews yet. Be the first to review this vehicle!
              </p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}
