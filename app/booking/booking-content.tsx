"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Check } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  dailyRate: number;
  imageUrl: string;
}

export default function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vehicleId = searchParams.get("vehicle");

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    reason?: string;
  } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [blockedDates, setBlockedDates] = useState<
    { id: string; startDate: string; endDate: string; source: string; summary: string }[]
  >([]);
  const [insurance, setInsurance] = useState<"basic" | "premium" | "full">("basic");
  const [addons, setAddons] = useState({
    childSeat: false,
    extraDriver: false,
    delivery: false,
  });

  useEffect(() => {
    if (vehicleId) {
      fetch(`/api/vehicles/${vehicleId}`)
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (data) setVehicle(data);
        })
        .catch(console.error);

      // Fetch blocked dates for this vehicle
      fetch(`/api/vehicles/${vehicleId}/blocked-dates`)
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (data?.blockedDates) setBlockedDates(data.blockedDates);
        })
        .catch(console.error);
    }
  }, [vehicleId]);

  useEffect(() => {
    if (vehicleId && formData.startDate && formData.endDate) {
      setCheckingAvailability(true);
      fetch(
        `/api/vehicles/${vehicleId}/availability?startDate=${formData.startDate}&endDate=${formData.endDate}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAvailability(data);
        })
        .catch(() => {
          setAvailability(null);
        })
        .finally(() => {
          setCheckingAvailability(false);
        });
    }
  }, [vehicleId, formData.startDate, formData.endDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (availability?.available === false) {
      toast.error("This vehicle is not available for the selected dates.");
      return;
    }

    setLoading(true);

    const extrasPayload = {
      insurance,
      addons,
      insuranceTotal,
      addonsTotal,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          ...formData,
          totalAmount: Math.round(total * 100),
          days,
          extras: JSON.stringify(extrasPayload),
        }),
      });

      if (res.ok) {
        router.push("/booking/confirmation");
      } else {
        toast.error("Failed to submit booking. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStripeCheckout() {
    if (!vehicle) return;
    if (availability?.available === false) {
      toast.error("This vehicle is not available for the selected dates.");
      return;
    }
    setLoading(true);

    const extrasPayload = {
      insurance,
      addons,
      insuranceTotal,
      addonsTotal,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          vehicleName: `${vehicle.make} ${vehicle.model}`,
          dailyRate: vehicle.dailyRate,
          days,
          totalAmount: Math.round(total * 100),
          ...formData,
          extras: JSON.stringify(extrasPayload),
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to start checkout. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const dailyRate = vehicle ? vehicle.dailyRate / 100 : 0;
  const days =
    formData.startDate && formData.endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  const insuranceRates = { basic: 0, premium: 35, full: 65 };
  const insuranceTotal = insuranceRates[insurance] * days;
  const addonRates = { childSeat: 25, extraDriver: 75, delivery: 75 };
  const addonsTotal =
    (addons.childSeat ? addonRates.childSeat : 0) * days +
    (addons.extraDriver ? addonRates.extraDriver : 0) * days +
    (addons.delivery ? addonRates.delivery : 0);

  const total = dailyRate * days + insuranceTotal + addonsTotal;

  return (
    <section className="pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={vehicle ? `/vehicles/${vehicle.id}` : "/vehicles"}
          className="inline-flex items-center gap-2 text-[13px] text-apple-gray hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display font-semibold text-[36px] sm:text-[46px] tracking-tight text-apple-black mb-2">
            Reserve Your Ride
          </h1>
          <p className="text-apple-gray text-[16px]">
            Complete your booking and we&apos;ll prepare your Miami experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-ink-card border border-ink-border rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display font-semibold text-[18px] text-apple-black mb-4">
                  Rental Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                      Pick-up Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full bg-ink border border-ink-border rounded-lg pl-10 pr-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                      Return Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full bg-ink border border-ink-border rounded-lg pl-10 pr-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>
                </div>

                {checkingAvailability && (
                  <div className="flex items-center gap-2 text-[12px] text-apple-gray">
                    <div className="w-3 h-3 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    Checking availability...
                  </div>
                )}
                {availability && !availability.available && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-[12px] text-red-400">
                    {availability.reason || "Not available for selected dates"}
                  </div>
                )}
                {availability?.available && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-[12px] text-green-400 flex items-center gap-2">
                    <Check className="w-3 h-3" />
                    Available for selected dates
                  </div>
                )}

                {/* Blocked Dates Summary */}
                {blockedDates.length > 0 && (
                  <div className="bg-ink border border-ink-border rounded-lg p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-gray mb-2">
                      Already Booked Periods
                    </p>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {blockedDates.slice(0, 5).map((bd) => (
                        <div
                          key={bd.id}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span className="text-red-400">
                            {bd.startDate} → {bd.endDate}
                          </span>
                          <span className="text-apple-gray/60 capitalize">
                            {bd.source}
                          </span>
                        </div>
                      ))}
                      {blockedDates.length > 5 && (
                        <p className="text-[10px] text-apple-gray/40 text-center">
                          +{blockedDates.length - 5} more periods
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Insurance Selection */}
                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-[18px] text-apple-black pt-4 border-t border-ink-border">
                    Insurance Coverage
                  </h3>
                  {[
                    { key: "basic" as const, label: "Basic Coverage", price: 0, desc: "Liability + collision ($2,500 deductible) — Included" },
                    { key: "premium" as const, label: "Premium Coverage", price: 35, desc: "Lower deductible ($500) + roadside assistance" },
                    { key: "full" as const, label: "Full Coverage", price: 65, desc: "Zero deductible + full protection + priority support" },
                  ].map((tier) => (
                    <label
                      key={tier.key}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        insurance === tier.key
                          ? "bg-gold/5 border-gold/50"
                          : "bg-ink border-ink-border hover:border-ink-border/80"
                      }`}
                    >
                      <input
                        type="radio"
                        name="insurance"
                        value={tier.key}
                        checked={insurance === tier.key}
                        onChange={() => setInsurance(tier.key)}
                        className="mt-1 accent-gold"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-semibold text-apple-black">{tier.label}</span>
                          <span className="text-[14px] text-gold font-semibold">
                            {tier.price === 0 ? "Included" : `+$${tier.price}/day`}
                          </span>
                        </div>
                        <p className="text-[12px] text-apple-gray mt-1">{tier.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Add-ons */}
                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-[18px] text-apple-black pt-4 border-t border-ink-border">
                    Add-ons
                  </h3>
                  {[
                    { key: "childSeat" as const, label: "Child/Baby Seat", price: 25, desc: "Safety-certified child seat" },
                    { key: "extraDriver" as const, label: "Additional Driver", price: 75, desc: "Add one more authorized driver" },
                    { key: "delivery" as const, label: "Airport/Hotel Delivery", price: 75, desc: "We deliver to your location (one-time fee)" },
                  ].map((addon) => (
                    <label
                      key={addon.key}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        addons[addon.key]
                          ? "bg-gold/5 border-gold/50"
                          : "bg-ink border-ink-border hover:border-ink-border/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={addons[addon.key]}
                        onChange={(e) => setAddons({ ...addons, [addon.key]: e.target.checked })}
                        className="mt-1 accent-gold"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-semibold text-apple-black">{addon.label}</span>
                          <span className="text-[14px] text-gold font-semibold">
                            +${addon.price}{addon.key === "delivery" ? "" : "/day"}
                          </span>
                        </div>
                        <p className="text-[12px] text-apple-gray mt-1">{addon.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Pick-up Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
                    <input
                      type="text"
                      required
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg pl-10 pr-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                      placeholder="Miami Airport, Hotel, Address..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Drop-off Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
                    <input
                      type="text"
                      required
                      value={formData.dropoffLocation}
                      onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg pl-10 pr-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                      placeholder="Same as pick-up or different location"
                    />
                  </div>
                </div>

                <h3 className="font-display font-semibold text-[18px] text-apple-black mb-4 pt-4 border-t border-ink-border">
                  Contact Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                      placeholder="Your phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Special Requests
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50 resize-none"
                    placeholder="Any special requests or notes..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleStripeCheckout}
                  disabled={loading || (availability?.available === false)}
                  className="w-full bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-4 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {loading ? "Processing..." : "Complete Booking & Pay"}
                </button>

                <p className="text-[11px] text-apple-gray text-center">
                  You will be redirected to Stripe to complete payment securely.
                </p>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-ink-card border border-ink-border rounded-2xl p-6 sticky top-24">
              <h3 className="font-display font-semibold text-[18px] text-apple-black mb-4">
                Booking Summary
              </h3>

              {vehicle ? (
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-ink-border">
                  <div className="relative w-20 h-14 bg-ink-light rounded-lg overflow-hidden">
                    <Image
                      src={vehicle.imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[12px] text-gold uppercase tracking-wider">{vehicle.category}</p>
                    <p className="font-semibold text-apple-black">
                      {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-apple-gray text-[14px] mb-6 pb-6 border-b border-ink-border">
                  No vehicle selected.{" "}
                  <Link href="/vehicles" className="text-gold hover:underline">
                    Browse fleet
                  </Link>
                </p>
              )}

              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between text-apple-gray">
                  <span>Daily Rate</span>
                  <span>${dailyRate.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-apple-gray">
                  <span>Days</span>
                  <span>{days}</span>
                </div>
                <div className="flex justify-between text-apple-gray">
                  <span>Insurance</span>
                  <span className="text-gold">
                    {insurance === "basic" ? "Included" : `+$${insuranceTotal.toFixed(0)}`}
                  </span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between text-apple-gray">
                    <span>Add-ons</span>
                    <span className="text-gold">+${addonsTotal.toFixed(0)}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-ink-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-apple-black">Total</span>
                  <span className="font-bold text-gold text-[24px]">${total.toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-ink rounded-xl">
                <p className="text-[12px] text-apple-gray leading-relaxed">
                  <span className="text-gold font-semibold">Secure Payment:</span> Your booking is confirmed immediately after payment. All major cards accepted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
