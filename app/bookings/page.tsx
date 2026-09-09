import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Car, ChevronRight, Clock } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      bookings: {
        include: { vehicle: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const bookings = user?.bookings || [];

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />

      <section className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-display font-semibold text-[36px] sm:text-[46px] tracking-tight text-apple-black mb-2">
              My Bookings
            </h1>
            <p className="text-apple-gray text-[16px]">
              View and manage your reservations.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-ink-card border border-ink-border rounded-2xl p-12 text-center">
              <Car className="w-12 h-12 text-apple-gray mx-auto mb-4" />
              <h3 className="font-semibold text-apple-black text-[18px] mb-2">
                No bookings yet
              </h3>
              <p className="text-apple-gray text-[14px] mb-6">
                You haven&apos;t made any reservations. Explore our fleet and book your Miami experience.
              </p>
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
              >
                Browse Fleet
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-ink-card border border-ink-border rounded-2xl p-6 hover:border-gold/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ink-light rounded-xl flex items-center justify-center">
                        <Car className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-apple-black">
                          {booking.vehicle.make} {booking.vehicle.model}
                        </p>
                        <div className="flex items-center gap-3 text-[12px] text-apple-gray mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            –{" "}
                            {new Date(booking.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gold font-semibold">
                        ${(booking.totalAmount / 100).toFixed(0)}
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-500/10 text-green-500"
                            : booking.status === "confirmed"
                            ? "bg-gold/10 text-gold"
                            : "bg-apple-gray/10 text-apple-gray"
                        }`}
                      >
                        {booking.paymentStatus === "paid" ? "Paid" : booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}
