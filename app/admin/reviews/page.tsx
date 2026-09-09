"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Check, X, ArrowLeft, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { toast } from "sonner";

interface Review {
  id: string;
  vehicleId: string;
  customerName: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: string;
  vehicle: { make: string; model: string };
}

export default function AdminReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/");
  }, [session, status, router]);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews?admin=true");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        toast.error("Failed to load reviews");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, approved: boolean) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (res.ok) {
        toast.success(approved ? "Review approved" : "Review rejected");
        fetchReviews();
      } else {
        toast.error("Failed to update review");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Review deleted");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

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
                Reviews
              </h1>
            </div>
            <div className="flex gap-2">
              {(["all", "pending", "approved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                    filter === f
                      ? "bg-gold text-ink"
                      : "bg-ink-card border border-ink-border text-apple-gray hover:text-apple-black"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink-border text-[11px] uppercase tracking-[0.15em] text-apple-gray">
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Review</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-ink-border/50 hover:bg-ink-light/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-[13px] text-apple-black">
                      {review.vehicle.make} {review.vehicle.model}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-apple-gray">
                      {review.customerName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "text-gold fill-gold"
                                : "text-apple-gray/30"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-apple-gray max-w-xs truncate">
                      {review.text}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                          review.approved
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {review.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!review.approved && (
                          <button
                            onClick={() => updateStatus(review.id, true)}
                            className="p-2 text-apple-gray hover:text-green-500 transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {review.approved && (
                          <button
                            onClick={() => updateStatus(review.id, false)}
                            className="p-2 text-apple-gray hover:text-yellow-500 transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-apple-gray hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredReviews.length === 0 && (
              <div className="text-center py-12 text-apple-gray text-[14px]">
                No reviews found.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
