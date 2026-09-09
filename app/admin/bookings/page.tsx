"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Car,
  User,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { toast } from "sonner";

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  vehicle: { make: string; model: string };
  user: { email: string; firstName: string; lastName: string };
}

const statusOptions = ["pending", "confirmed", "completed", "cancelled"];
const paymentOptions = ["unpaid", "paid", "refunded"];

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/");
  }, [session, status, router]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchBookings();
  }, [filter, page]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const url = new URL("/api/admin/bookings", window.location.origin);
      if (filter) url.searchParams.set("status", filter);
      url.searchParams.set("page", String(page));
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
        setTotalPages(data.pages);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchBookings();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function updatePayment(id: string, paymentStatus: string) {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) {
        toast.success("Payment status updated");
        fetchBookings();
      } else {
        toast.error("Failed to update payment status");
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-[13px] text-apple-gray hover:text-gold transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="font-display font-semibold text-[36px] tracking-tight text-apple-black">
                All Bookings
              </h1>
            </div>
            <div className="flex gap-2">
              {["", "pending", "confirmed", "completed", "cancelled"].map((s) => (
                <button
                  key={s || "all"}
                  onClick={() => { setFilter(s); setPage(1); }}
                  className={`text-[12px] font-medium tracking-wide px-4 py-2 rounded-full transition-colors ${
                    filter === s
                      ? "bg-gold text-ink"
                      : "bg-ink-card text-apple-gray hover:text-apple-black border border-ink-border"
                  }`}
                >
                  {s || "All"}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="border-b border-ink-border text-[11px] uppercase tracking-[0.15em] text-apple-gray">
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-ink-border/50 hover:bg-ink-light/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                            <Car className="w-4 h-4 text-gold" />
                          </div>
                          <p className="font-semibold text-apple-black text-[13px]">
                            {b.vehicle.make} {b.vehicle.model}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-apple-gray" />
                          <span className="text-[13px] text-apple-gray">{b.user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[12px] text-apple-gray">
                          <Calendar className="w-3 h-3" />
                          {new Date(b.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          –{" "}
                          {new Date(b.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gold font-semibold">
                        ${(b.totalAmount / 100).toFixed(0)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className="bg-ink border border-ink-border rounded-lg px-2 py-1 text-[11px] text-apple-black focus:outline-none focus:border-gold/50"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={b.paymentStatus}
                          onChange={(e) => updatePayment(b.id, e.target.value)}
                          className="bg-ink border border-ink-border rounded-lg px-2 py-1 text-[11px] text-apple-black focus:outline-none focus:border-gold/50"
                        >
                          {paymentOptions.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-apple-gray hover:text-gold transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[13px] text-apple-gray">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-apple-gray hover:text-gold transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
