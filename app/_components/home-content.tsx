"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  ChevronRight,
  Shield,
  Clock,
  Star,
  Car,
  Phone,
  MessageSquare,
  ArrowRight,
  Quote,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { Carousel } from "@/components/carousel";

const ease = [0.16, 1, 0.3, 1] as const;

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────── HERO ─────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Priority poster image for LCP */}
      <Image
        src="/images/hero-dark.png"
        alt="Luxury cars on Miami streets"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-[1]"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlays for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-3 text-gold text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] mb-6">
            <span className="h-px w-6 bg-gold/60" />
            Miami&apos;s Premier Luxury Fleet
          </span>
          <h1 className="font-display font-semibold text-[58px] sm:text-[78px] lg:text-[92px] leading-[0.95] tracking-tight text-apple-black mb-6">
            Drive Miami
            <br />
            <span className="text-gold-gradient">Differently.</span>
          </h1>
          <p className="text-apple-gray text-[16px] sm:text-[18px] leading-relaxed max-w-lg mb-10">
            Handpicked luxury vehicles with concierge-level service. From exotic
            sports cars to ultra-luxury SUVs — delivered to your door.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 bg-gold text-ink text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.12em] px-8 py-4 rounded-lg hover:bg-gold-light transition-colors"
            >
              Browse Fleet
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 bg-transparent border border-ink-border text-apple-black text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.12em] px-8 py-4 rounded-lg hover:bg-ink-card/50 transition-colors"
            >
              Reserve Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <div className="font-display font-bold text-[28px] text-gold leading-none">4.9</div>
              <div className="text-[12px] text-apple-gray mt-1">★★★★★ 200+ reviews</div>
            </div>
            <div className="w-px h-10 bg-ink-border hidden sm:block" />
            <div>
              <div className="font-display font-bold text-[28px] text-gold leading-none">25+</div>
              <div className="text-[12px] text-apple-gray mt-1">Luxury vehicles</div>
            </div>
            <div className="w-px h-10 bg-ink-border hidden sm:block" />
            <div>
              <div className="font-display font-bold text-[28px] text-gold leading-none">MIA</div>
              <div className="text-[12px] text-apple-gray mt-1">Airport delivery</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────── BOOKING BAR ─────────── */
function BookingBar() {
  const [pickup, setPickup] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <section className="relative z-20 -mt-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="bg-ink-card/95 backdrop-blur-xl border border-ink-border rounded-2xl p-6 sm:p-8 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.7)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-2">
                Pick-up Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
                <input
                  type="text"
                  placeholder="Miami Airport, South Beach..."
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-ink border border-ink-border rounded-lg pl-10 pr-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-2">
                Pick-up Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-ink border border-ink-border rounded-lg pl-10 pr-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-2">
                Return Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-ink border border-ink-border rounded-lg pl-10 pr-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Link
                href={`/vehicles?pickup=${encodeURIComponent(pickup)}&startDate=${startDate}&endDate=${endDate}`}
                className="w-full bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-3.5 rounded-lg hover:bg-gold-light transition-colors text-center"
              >
                Search Cars
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────── FEATURED FLEET ─────────── */
interface FeaturedVehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  dailyRate: number;
  imageUrl: string;
  seats: number;
  transmission: string;
}

function VehicleCard({ vehicle, index }: { vehicle: FeaturedVehicle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
      className="group"
    >
      <Link href={`/vehicles/${vehicle.id}`}>
        <div className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden hover:border-gold/30 transition-colors">
          <div className="relative aspect-[16/10] bg-ink-light overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-ink-card via-transparent to-transparent z-10" />
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              {vehicle.category}
            </span>
            <h3 className="font-display font-semibold text-[20px] text-apple-black mt-1 mb-2">
              {vehicle.make} {vehicle.model}
            </h3>
            <div className="flex items-center gap-4 text-[12px] text-apple-gray mb-4">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5" />
                {vehicle.seats} Seats
              </span>
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gold font-semibold text-[18px]">
                  ${(vehicle.dailyRate / 100).toFixed(0)}
                </span>
                <span className="text-apple-gray text-[12px]">/day</span>
              </div>
              <span className="text-gold text-[12px] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Reserve <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedFleet({ vehicles }: { vehicles: FeaturedVehicle[] }) {
  return (
    <section className="py-24 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.2em]">
              Our Collection
            </span>
            <h2 className="font-display font-semibold text-[34px] sm:text-[46px] lg:text-[52px] tracking-tight text-apple-black mt-3">
              Featured Fleet
            </h2>
            <p className="text-apple-gray text-[16px] max-w-xl mx-auto mt-4">
              Handpicked luxury vehicles for every Miami moment.
            </p>
          </div>
        </FadeIn>

        <div className="px-8">
          <Carousel itemsPerView={3} autoPlay autoPlayInterval={6000}>
            {vehicles.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </Carousel>
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center mt-12">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 border border-gold/50 text-gold text-[12px] font-semibold uppercase tracking-[0.12em] px-8 py-3.5 rounded-lg hover:bg-gold/10 transition-colors"
            >
              View All Vehicles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────── STATS ─────────── */
function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1600;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 50, suffix: "+", label: "Luxury Vehicles" },
  { value: 5000, suffix: "+", label: "Happy Clients" },
  { value: 99, suffix: "%", label: "Satisfaction Rate" },
  { value: 24, suffix: "/7", label: "Concierge Support" },
];

function StatsBar() {
  return (
    <section className="py-20 bg-ink-light border-y border-ink-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <div className="font-display font-bold text-[36px] sm:text-[48px] text-gold-gradient leading-none">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-apple-gray text-[13px] sm:text-[14px] mt-2 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── SERVICES ─────────── */
const services = [
  {
    icon: Car,
    title: "Doorstep Delivery",
    description: "We deliver your vehicle anywhere in Miami — airport, hotel, or residence.",
  },
  {
    icon: Shield,
    title: "Full Insurance",
    description: "Comprehensive coverage included with every rental for total peace of mind.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock concierge assistance for any need during your rental.",
  },
  {
    icon: Star,
    title: "Premium Experience",
    description: "Impeccably maintained vehicles with white-glove service standards.",
  },
];

function ServicesSection() {
  return (
    <section className="py-24 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.2em]">
              Why Choose Us
            </span>
            <h2 className="font-display font-semibold text-[34px] sm:text-[46px] lg:text-[52px] tracking-tight text-apple-black mt-3">
              The Z Experience
            </h2>
            <p className="text-apple-gray text-[16px] max-w-xl mx-auto mt-4">
              More than a rental — a curated Miami lifestyle experience.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <FadeIn key={service.title} delay={i * 0.1}>
              <div className="bg-ink-card border border-ink-border rounded-2xl p-8 hover:border-gold/20 transition-colors">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display font-semibold text-[18px] text-apple-black mb-3">
                  {service.title}
                </h3>
                <p className="text-apple-gray text-[14px] leading-relaxed">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── TESTIMONIALS ─────────── */
const testimonials = [
  {
    name: "Marcus T.",
    location: "New York, NY",
    text: "The Porsche Macan was immaculate and the delivery to my hotel was seamless. Best car rental experience I've ever had.",
    rating: 5,
  },
  {
    name: "Sophia L.",
    location: "London, UK",
    text: "Z Car Rental made our Miami trip unforgettable. The Boxster S was perfect for cruising Ocean Drive at sunset.",
    rating: 5,
  },
  {
    name: "James R.",
    location: "Los Angeles, CA",
    text: "Concierge-level service from start to finish. They even recommended the best restaurants in Wynwood.",
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className="py-24 bg-ink-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.2em]">
              Client Stories
            </span>
            <h2 className="font-display font-semibold text-[34px] sm:text-[46px] lg:text-[52px] tracking-tight text-apple-black mt-3">
              What They Say
            </h2>
          </div>
        </FadeIn>

        <div className="px-8">
          <Carousel itemsPerView={3} autoPlay autoPlayInterval={8000}>
            {testimonials.map((t) => (
              <div key={t.name} className="bg-ink-card border border-ink-border rounded-2xl p-8 h-full">
                <Quote className="w-8 h-8 text-gold/30 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-apple-gray text-[15px] leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-semibold text-[14px]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-apple-black font-semibold text-[14px]">{t.name}</p>
                    <p className="text-apple-gray text-[12px]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

/* ─────────── CONTACT / CTA ─────────── */
function ContactSection() {
  return (
    <section className="py-24 bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-light to-ink" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div>
              <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.2em]">
                Get in Touch
              </span>
              <h2 className="font-display font-semibold text-[34px] sm:text-[46px] lg:text-[52px] tracking-tight text-apple-black mt-3 mb-6">
                Ready for Your
                <br />
                <span className="text-gold-gradient">Miami Experience?</span>
              </h2>
              <p className="text-apple-gray text-[16px] leading-relaxed mb-8">
                Whether you need a recommendation or have a specific request, our
                concierge team is here to craft your perfect Miami moment.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+15619476388"
                  className="flex items-center gap-4 text-apple-black hover:text-gold transition-colors"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-[12px] text-apple-gray uppercase tracking-wider">Call Us</p>
                    <p className="text-[16px] font-semibold">(561) 947-6388</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/15619476388"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-apple-black hover:text-gold transition-colors"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-[12px] text-apple-gray uppercase tracking-wider">WhatsApp</p>
                    <p className="text-[16px] font-semibold">Chat with Concierge</p>
                  </div>
                </a>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-ink-card border border-ink-border rounded-2xl p-8">
              <h3 className="font-display font-semibold text-[22px] text-apple-black mb-6">
                Request a Recommendation
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Your phone"
                      className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Where in Miami?"
                    className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-4 rounded-lg hover:bg-gold-light transition-colors"
                >
                  Get Recommendations
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─────────── MARQUEE ─────────── */
const marqueeItems = [
  "Porsche",
  "Mercedes-Benz",
  "BMW",
  "Corvette",
  "Luxury SUVs",
  "Convertibles",
  "Sports Cars",
  "Exotic",
];

function MarqueeSection() {
  return (
    <section className="py-8 bg-ink border-y border-ink-border/50 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span
            key={i}
            className="text-[14px] font-semibold uppercase tracking-[0.2em] text-apple-gray/40 mx-8"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─────────── EXPORT ─────────── */
export function HomeContent({ featuredVehicles }: { featuredVehicles: { id: string; make: string; model: string; category: string; dailyRate: number; imageUrl: string; seats: number; transmission: string }[] }) {
  return (
    <>
      <HeroSection />
      <BookingBar />
      <MarqueeSection />
      <FeaturedFleet vehicles={featuredVehicles} />
      <StatsBar />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
