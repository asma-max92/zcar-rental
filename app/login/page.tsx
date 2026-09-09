"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Invalid email or password");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />

      <section className="pt-32 pb-20">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] text-apple-gray hover:text-gold transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="text-center mb-8">
              <h1 className="font-display font-semibold text-[32px] text-apple-black">
                Welcome Back
              </h1>
              <p className="text-apple-gray text-[14px] mt-2">
                Sign in to manage your bookings
              </p>
            </div>

            <div className="bg-ink-card border border-ink-border rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 pr-12 text-[14px] text-apple-black placeholder:text-apple-gray/50 focus:outline-none focus:border-gold/50"
                      placeholder="Your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray hover:text-apple-black"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-4 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="text-center text-[13px] text-apple-gray mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-gold hover:text-gold-light transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
