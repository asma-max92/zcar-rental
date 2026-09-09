"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Car, ChevronRight, Filter, Search, X } from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  dailyRate: number;
  imageUrl: string;
  seats: number;
  transmission: string;
  featured: boolean;
}

const categories = ["All", "Luxury SUV", "Convertible", "Sports Car", "Exotic", "Performance Coupe", "Ultra Luxury Sedan"];

export default function VehiclesContent({ vehicles }: { vehicles: Vehicle[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [transmissionFilter, setTransmissionFilter] = useState<string>("All");
  const [minSeats, setMinSeats] = useState<number | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    if (activeCategory !== "All" && v.category !== activeCategory) return false;
    if (searchQuery && !(`${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    if (maxPrice && v.dailyRate > maxPrice * 100) return false;
    if (transmissionFilter !== "All" && v.transmission !== transmissionFilter) return false;
    if (minSeats && v.seats < minSeats) return false;
    return true;
  });

  return (
    <>
      <section className="sticky top-16 md:top-20 z-30 bg-ink/95 backdrop-blur-xl border-b border-ink-border/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
              <input
                type="text"
                placeholder="Search make or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-ink border border-ink-border rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray hover:text-apple-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={maxPrice ?? ""}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                className="bg-ink border border-ink-border rounded-lg px-3 py-2.5 text-[13px] text-apple-black focus:outline-none focus:border-gold/50"
              >
                <option value="">Max Price</option>
                <option value="300">$300/day</option>
                <option value="500">$500/day</option>
                <option value="700">$700/day</option>
                <option value="1000">$1,000/day</option>
              </select>
              <select
                value={transmissionFilter}
                onChange={(e) => setTransmissionFilter(e.target.value)}
                className="bg-ink border border-ink-border rounded-lg px-3 py-2.5 text-[13px] text-apple-black focus:outline-none focus:border-gold/50"
              >
                <option value="All">Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
              <select
                value={minSeats ?? ""}
                onChange={(e) => setMinSeats(e.target.value ? Number(e.target.value) : null)}
                className="bg-ink border border-ink-border rounded-lg px-3 py-2.5 text-[13px] text-apple-black focus:outline-none focus:border-gold/50"
              >
                <option value="">Seats</option>
                <option value="2">2+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-apple-gray flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-[12px] font-medium tracking-wide px-4 py-2 rounded-full transition-colors ${
                  activeCategory === cat ? "bg-gold text-ink" : "bg-ink-card text-apple-gray hover:text-apple-black border border-ink-border"
                }`}
              >
                {cat}
              </button>
            ))}
            {(searchQuery || maxPrice || transmissionFilter !== "All" || minSeats || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setMaxPrice(null);
                  setTransmissionFilter("All");
                  setMinSeats(null);
                  setActiveCategory("All");
                }}
                className="flex-shrink-0 text-[12px] text-red-400 hover:text-red-300 transition-colors ml-2"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="group">
                <Link href={`/vehicles/${vehicle.id}`}>
                  <div className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden hover:border-gold/30 transition-colors">
                    <div className="relative aspect-[16/10] bg-ink-light overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-card via-transparent to-transparent z-10" />
                      <Image
                        src={vehicle.imageUrl}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {vehicle.featured && (
                        <span className="absolute top-4 right-4 z-20 bg-gold text-ink text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Featured</span>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{vehicle.category}</span>
                      <h3 className="font-display font-semibold text-[20px] text-apple-black mt-1 mb-2">{vehicle.make} {vehicle.model}</h3>
                      <div className="flex items-center gap-4 text-[12px] text-apple-gray mb-4">
                        <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" />{vehicle.seats} Seats</span>
                        <span>{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gold font-semibold text-[18px]">${(vehicle.dailyRate / 100).toFixed(0)}</span>
                          <span className="text-apple-gray text-[12px]">/day</span>
                        </div>
                        <span className="text-gold text-[12px] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Reserve <ChevronRight className="w-4 h-4" /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-20">
              <Car className="w-12 h-12 text-apple-gray mx-auto mb-4" />
              <h3 className="font-semibold text-apple-black text-[18px] mb-2">No vehicles found</h3>
              <p className="text-apple-gray text-[14px]">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
