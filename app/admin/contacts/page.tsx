"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Trash2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
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
    fetchContacts();
  }, [filter, page]);

  async function fetchContacts() {
    setLoading(true);
    try {
      const url = new URL("/api/admin/contacts", window.location.origin);
      if (filter) url.searchParams.set("status", filter);
      url.searchParams.set("page", String(page));
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts);
        setTotalPages(data.pages);
      } else {
        toast.error("Failed to load contacts");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchContacts();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Deleted");
        fetchContacts();
      } else {
        toast.error("Failed to delete");
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
                Contact Submissions
              </h1>
            </div>
            <div className="flex gap-2">
              {["", "new", "read", "resolved"].map((s) => (
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

          <div className="space-y-4">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="bg-ink-card border border-ink-border rounded-2xl p-6 hover:border-gold/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-apple-black text-[15px]">
                          {c.name}
                        </p>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            c.status === "new"
                              ? "bg-gold/10 text-gold"
                              : c.status === "read"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-green-500/10 text-green-500"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[12px] text-apple-gray mb-1">{c.email}</p>
                      <p className="text-[13px] text-apple-black font-medium mb-2">
                        {c.subject}
                      </p>
                      <p className="text-[13px] text-apple-gray leading-relaxed">
                        {c.message}
                      </p>
                      <p className="text-[11px] text-apple-gray mt-3">
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.status === "new" && (
                      <button
                        onClick={() => updateStatus(c.id, "read")}
                        className="flex items-center gap-1.5 text-[11px] text-blue-500 hover:text-blue-400 transition-colors px-3 py-2 rounded-lg bg-blue-500/10"
                      >
                        <Circle className="w-3 h-3" />
                        Mark Read
                      </button>
                    )}
                    {c.status !== "resolved" && (
                      <button
                        onClick={() => updateStatus(c.id, "resolved")}
                        className="flex items-center gap-1.5 text-[11px] text-green-500 hover:text-green-400 transition-colors px-3 py-2 rounded-lg bg-green-500/10"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 text-apple-gray hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {contacts.length === 0 && (
            <div className="text-center py-20">
              <Mail className="w-12 h-12 text-apple-gray mx-auto mb-4" />
              <h3 className="font-semibold text-apple-black text-[18px] mb-2">
                No submissions
              </h3>
              <p className="text-apple-gray text-[14px]">
                No contact submissions match this filter.
              </p>
            </div>
          )}

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
