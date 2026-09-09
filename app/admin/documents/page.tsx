"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Upload,
  Trash2,
  ArrowLeft,
  Download,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { toast } from "sonner";
import { uploadDocument } from "./actions";

interface DocumentItem {
  id: string;
  name: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

const categories = [
  { value: "fleet-registration", label: "Fleet Registration" },
  { value: "insurance", label: "Insurance" },
  { value: "license", label: "License / Permit" },
  { value: "contract", label: "Contract" },
  { value: "other", label: "Other" },
];

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function AdminDocumentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("other");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/");
  }, [session, status, router]);

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const url = new URL("/api/admin/documents", window.location.origin);
      if (filter) url.searchParams.set("category", filter);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents);
      } else {
        toast.error("Failed to load documents");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const result = await uploadDocument(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Document uploaded");
        setFile(null);
        setCategory("other");
        fetchDocuments();
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Document deleted");
        fetchDocuments();
      } else {
        toast.error("Failed to delete document");
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
                Documents
              </h1>
            </div>
            <div className="flex gap-2">
              {["", "fleet-registration", "insurance", "license", "contract", "other"].map((c) => (
                <button
                  key={c || "all"}
                  onClick={() => setFilter(c)}
                  className={`text-[12px] font-medium tracking-wide px-4 py-2 rounded-full transition-colors ${
                    filter === c
                      ? "bg-gold text-ink"
                      : "bg-ink-card text-apple-gray hover:text-apple-black border border-ink-border"
                  }`}
                >
                  {c ? categories.find((x) => x.value === c)?.label || c : "All"}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Form */}
          <div className="bg-ink-card border border-ink-border rounded-2xl p-6 mb-10">
            <h2 className="font-semibold text-apple-black text-[18px] mb-6">Upload Document</h2>
            <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                  File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="flex items-center gap-3 w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black cursor-pointer hover:border-gold/50 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-gold" />
                    <span className="truncate">
                      {file ? file.name : "Choose a file (max 10MB)"}
                    </span>
                    {file && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                        className="ml-auto p-1 text-apple-gray hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </label>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black focus:outline-none focus:border-gold/50"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full sm:w-auto bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>

          {/* Documents List */}
          <div className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink-border text-[11px] uppercase tracking-[0.15em] text-apple-gray">
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-ink-border/50 hover:bg-ink-light/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="font-semibold text-apple-black text-[14px]">{doc.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] uppercase tracking-wider px-2 py-1 rounded-full bg-ink-light text-apple-gray">
                        {categories.find((c) => c.value === doc.category)?.label || doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-apple-gray">
                      {formatBytes(doc.fileSize)}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-apple-gray">
                      {new Date(doc.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={doc.fileUrl}
                          download
                          className="p-2 text-apple-gray hover:text-gold transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id)}
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
            {documents.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-apple-gray mx-auto mb-4" />
                <h3 className="font-semibold text-apple-black text-[18px] mb-2">No documents</h3>
                <p className="text-apple-gray text-[14px]">
                  Upload fleet registrations, insurance papers, and other business documents.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
