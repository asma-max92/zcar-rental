"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Plus,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  dailyRate: number;
  seats: number;
  transmission: string;
  horsepower?: number;
  topSpeed?: string;
  description?: string;
  imageUrl: string;
  turoIcalUrl?: string;
  featured: boolean;
  available: boolean;
}

export default function AdminVehiclesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Calendar availability state
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarVehicle, setCalendarVehicle] = useState<Vehicle | null>(null);
  const [blockedDates, setBlockedDates] = useState<Array<{ id: string; startDate: string; endDate: string; summary: string }>>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [newBlock, setNewBlock] = useState({ startDate: "", endDate: "", summary: "Unavailable" });
  const [calendarSubmitting, setCalendarSubmitting] = useState(false);

  const [form, setForm] = useState({
    make: "",
    model: "",
    category: "Luxury SUV",
    dailyRate: "",
    seats: "4",
    transmission: "Automatic",
    horsepower: "",
    topSpeed: "",
    description: "",
    imageUrl: "",
    turoIcalUrl: "",
    featured: false,
    available: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/");
  }, [session, status, router]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    setLoading(true);
    try {
      const res = await fetch("/api/vehicles");
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      } else {
        toast.error("Failed to load vehicles");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setForm({
      make: "",
      model: "",
      category: "Luxury SUV",
      dailyRate: "",
      seats: "4",
      transmission: "Automatic",
      horsepower: "",
      topSpeed: "",
      description: "",
      imageUrl: "",
      turoIcalUrl: "",
      featured: false,
      available: true,
    });
    setModalOpen(true);
  }

  function openEdit(v: Vehicle) {
    setEditing(v);
    setForm({
      make: v.make,
      model: v.model,
      category: v.category,
      dailyRate: String(v.dailyRate / 100),
      seats: String(v.seats),
      transmission: v.transmission,
      horsepower: String(v.horsepower || ""),
      topSpeed: String(v.topSpeed || ""),
      description: String(v.description || ""),
      imageUrl: v.imageUrl || "",
      turoIcalUrl: v.turoIcalUrl || "",
      featured: v.featured,
      available: v.available,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      ...form,
      dailyRate: Math.round(Number(form.dailyRate) * 100),
      seats: Number(form.seats),
    };

    try {
      const url = editing
        ? `/api/admin/vehicles/${editing.id}`
        : "/api/admin/vehicles";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editing ? "Vehicle updated" : "Vehicle created");
        setModalOpen(false);
        fetchVehicles();
      } else {
        toast.error("Failed to save vehicle");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Vehicle deleted");
        fetchVehicles();
      } else {
        toast.error("Failed to delete vehicle");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function syncTuro(id: string) {
    const toastId = toast.loading("Syncing Turo calendar...");
    try {
      const res = await fetch(`/api/admin/vehicles/${id}/sync-turo`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Synced ${data.blockedDatesCreated} blocked dates from Turo`, { id: toastId });
      } else {
        toast.error(data.error || "Failed to sync Turo calendar", { id: toastId });
      }
    } catch {
      toast.error("Something went wrong", { id: toastId });
    }
  }

  // Calendar availability functions
  async function openCalendar(v: Vehicle) {
    setCalendarVehicle(v);
    setCalendarOpen(true);
    setCalendarLoading(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${v.id}/blocked-dates`);
      if (res.ok) {
        const data = await res.json();
        setBlockedDates(data);
      } else {
        toast.error("Failed to load calendar");
      }
    } catch {
      toast.error("Failed to load calendar");
    } finally {
      setCalendarLoading(false);
    }
  }

  async function addBlockedDate(e: React.FormEvent) {
    e.preventDefault();
    if (!calendarVehicle || calendarSubmitting) return;
    if (!newBlock.startDate || !newBlock.endDate) {
      toast.error("Select start and end dates");
      return;
    }
    setCalendarSubmitting(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${calendarVehicle.id}/blocked-dates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlock),
      });
      if (res.ok) {
        toast.success("Blocked date added");
        setNewBlock({ startDate: "", endDate: "", summary: "Unavailable" });
        // Refresh list
        const refreshed = await fetch(`/api/admin/vehicles/${calendarVehicle.id}/blocked-dates`);
        if (refreshed.ok) setBlockedDates(await refreshed.json());
      } else {
        toast.error("Failed to add blocked date");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCalendarSubmitting(false);
    }
  }

  async function deleteBlockedDate(blockedDateId: string) {
    if (!calendarVehicle) return;
    if (!confirm("Remove this blocked date?")) return;
    try {
      const res = await fetch(`/api/admin/vehicles/${calendarVehicle.id}/blocked-dates/${blockedDateId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Blocked date removed");
        setBlockedDates(blockedDates.filter((b) => b.id !== blockedDateId));
      } else {
        toast.error("Failed to remove");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-ink">
        <SiteHeader />
        <div className="pt-32 pb-20 text-center text-apple-gray">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-[13px] text-apple-gray hover:text-gold transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="font-display font-semibold text-[36px] tracking-tight text-apple-black">
                Manage Fleet
              </h1>
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-5 py-3 rounded-lg hover:bg-gold-light transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>

          <div className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink-border text-[11px] uppercase tracking-[0.15em] text-apple-gray">
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Rate/Day</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-ink-border/50 hover:bg-ink-light/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-ink-light rounded-lg flex items-center justify-center">
                          <Car className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="font-semibold text-apple-black text-[14px]">
                            {v.make} {v.model}
                          </p>
                          <p className="text-[11px] text-apple-gray">
                            {v.seats} seats · {v.transmission}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-apple-gray">
                      {v.category}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gold font-semibold">
                      ${(v.dailyRate / 100).toFixed(0)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                            v.available
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {v.available ? "Available" : "Unavailable"}
                        </span>
                        {v.featured && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-gold/10 text-gold">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openCalendar(v)}
                          title="Manage Calendar"
                          className="p-2 text-apple-gray hover:text-blue-400 transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        {v.turoIcalUrl && (
                          <button
                            onClick={() => syncTuro(v.id)}
                            title="Sync Turo Calendar"
                            className="p-2 text-apple-gray hover:text-blue-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => openEdit(v)}
                          className="p-2 text-apple-gray hover:text-gold transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-2 text-apple-gray hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Calendar Modal */}
      {calendarOpen && calendarVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-ink-card border border-ink-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-ink-border">
              <div>
                <h2 className="font-semibold text-apple-black text-[18px]">
                  {calendarVehicle.make} {calendarVehicle.model}
                </h2>
                <p className="text-[12px] text-apple-gray mt-1">Calendar Availability</p>
              </div>
              <button
                onClick={() => setCalendarOpen(false)}
                className="p-2 text-apple-gray hover:text-apple-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Add blocked date form */}
              <form onSubmit={addBlockedDate} className="bg-ink-light rounded-xl p-4 space-y-3">
                <h3 className="text-[13px] font-semibold text-apple-black">Block Dates</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-1.5">From</label>
                    <input
                      type="date"
                      required
                      value={newBlock.startDate}
                      onChange={(e) => setNewBlock({ ...newBlock, startDate: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg px-3 py-2.5 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-1.5">To</label>
                    <input
                      type="date"
                      required
                      value={newBlock.endDate}
                      onChange={(e) => setNewBlock({ ...newBlock, endDate: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg px-3 py-2.5 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-1.5">Reason</label>
                  <input
                    value={newBlock.summary}
                    onChange={(e) => setNewBlock({ ...newBlock, summary: e.target.value })}
                    placeholder="e.g. Maintenance, Booked, etc."
                    className="w-full bg-ink border border-ink-border rounded-lg px-3 py-2.5 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={calendarSubmitting}
                  className="w-full bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-4 py-2.5 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
                >
                  {calendarSubmitting ? "Adding..." : "Block Dates"}
                </button>
              </form>

              {/* Blocked dates list */}
              <div>
                <h3 className="text-[13px] font-semibold text-apple-black mb-3">
                  Blocked Dates ({blockedDates.length})
                </h3>
                {calendarLoading ? (
                  <p className="text-[13px] text-apple-gray">Loading...</p>
                ) : blockedDates.length === 0 ? (
                  <p className="text-[13px] text-apple-gray">No blocked dates. Vehicle is fully available.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {blockedDates.map((b) => (
                      <div key={b.id} className="flex items-center justify-between bg-ink-light rounded-lg px-4 py-3">
                        <div>
                          <p className="text-[13px] text-apple-black font-medium">
                            {new Date(b.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            {" — "}
                            {new Date(b.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          <p className="text-[11px] text-apple-gray">{b.summary}</p>
                        </div>
                        <button
                          onClick={() => deleteBlockedDate(b.id)}
                          className="p-1.5 text-apple-gray hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-ink-card border border-ink-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-ink-border">
              <h2 className="font-semibold text-apple-black text-[18px]">
                {editing ? "Edit Vehicle" : "Add Vehicle"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-apple-gray hover:text-apple-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Make *
                  </label>
                  <input
                    required
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Model *
                  </label>
                  <input
                    required
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                >
                  {["Luxury SUV", "Convertible", "Sports Car", "Exotic", "Performance Coupe", "Ultra Luxury Sedan"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Daily Rate ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.dailyRate}
                    onChange={(e) => setForm({ ...form, dailyRate: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Seats
                  </label>
                  <input
                    type="number"
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                  Image URL
                </label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/images/vehicle-name.jpg"
                  className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                  Turo iCal URL
                </label>
                <input
                  value={form.turoIcalUrl}
                  onChange={(e) => setForm({ ...form, turoIcalUrl: e.target.value })}
                  placeholder="https://turo.com/ical/xxxxx.ics"
                  className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                />
                <p className="text-[10px] text-apple-gray/60 mt-1">
                  Paste the iCal export URL from Turo to sync blocked dates
                </p>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[13px] text-apple-gray cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-gold"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-[13px] text-apple-gray cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="w-4 h-4 accent-gold"
                  />
                  Available
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : editing ? "Update Vehicle" : "Create Vehicle"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
