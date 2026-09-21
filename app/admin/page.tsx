export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Calendar,
  DollarSign,
  Mail,
  ArrowRight,
  FileText,
  Star,
  TrendingUp,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "admin") {
    redirect("/");
  }

  // Fetch stats
  const [
    totalBookings,
    totalVehicles,
    pendingReviews,
    confirmedBookings,
    cancelledBookings,
    recentBookings,
    recentContacts,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.vehicle.count(),
    prisma.review.count({ where: { approved: false } }),
    prisma.booking.count({ where: { status: "confirmed" } }),
    prisma.booking.count({ where: { status: "cancelled" } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { vehicle: true, user: true },
    }),
    prisma.contactSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenue = await prisma.booking.aggregate({
    _sum: { totalAmount: true },
    where: { paymentStatus: "paid" },
  });

  // Daily revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);
  const paidBookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      paymentStatus: "paid",
    },
    select: { createdAt: true, totalAmount: true },
    orderBy: { createdAt: "asc" },
  });
  const revenueByDay: Record<string, number> = {};
  for (const b of paidBookings) {
    const d = b.createdAt.toISOString().split("T")[0];
    revenueByDay[d] = (revenueByDay[d] || 0) + b.totalAmount;
  }
  const dailyRevenue = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const ds = d.toISOString().split("T")[0];
    dailyRevenue.push({ date: ds, revenue: revenueByDay[ds] || 0 });
  }

  // Top vehicles by booking count
  const topVehicles = await prisma.vehicle.findMany({
    take: 5,
    orderBy: { bookings: { _count: "desc" } },
    select: {
      id: true,
      make: true,
      model: true,
      _count: { select: { bookings: true } },
    },
  });

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      label: "Revenue",
      value: `$${((totalRevenue._sum.totalAmount || 0) / 100).toFixed(0)}`,
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Confirmed",
      value: confirmedBookings,
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Cancelled",
      value: cancelledBookings,
      icon: Calendar,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Vehicles",
      value: totalVehicles,
      icon: Car,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Pending Reviews",
      value: pendingReviews,
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  const maxDailyRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 1);

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-display font-semibold text-[36px] sm:text-[46px] tracking-tight text-apple-black mb-2">
              Admin Dashboard
            </h1>
            <p className="text-apple-gray text-[16px]">
              Overview of your rental business.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-ink-card border border-ink-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="font-semibold text-[24px] text-apple-black">{stat.value}</p>
                <p className="text-[12px] text-apple-gray mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Link
              href="/admin/vehicles"
              className="bg-ink-card border border-ink-border rounded-2xl p-6 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <p className="font-semibold text-[15px] text-apple-black">Manage Fleet</p>
              <p className="text-[12px] text-apple-gray mt-1">Add, edit, or remove vehicles</p>
            </Link>
            <Link
              href="/admin/bookings"
              className="bg-ink-card border border-ink-border rounded-2xl p-6 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gold" />
                </div>
              </div>
              <p className="font-semibold text-[15px] text-apple-black">All Bookings</p>
              <p className="text-[12px] text-apple-gray mt-1">View and update reservations</p>
            </Link>
            <Link
              href="/admin/contacts"
              className="bg-ink-card border border-ink-border rounded-2xl p-6 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="font-semibold text-[15px] text-apple-black">Contacts</p>
              <p className="text-[12px] text-apple-gray mt-1">Manage submissions</p>
            </Link>
            <Link
              href="/admin/documents"
              className="bg-ink-card border border-ink-border rounded-2xl p-6 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
              </div>
              <p className="font-semibold text-[15px] text-apple-black">Documents</p>
              <p className="text-[12px] text-apple-gray mt-1">Fleet registrations & more</p>
            </Link>
            <Link
              href="/admin/reviews"
              className="bg-ink-card border border-ink-border rounded-2xl p-6 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <p className="font-semibold text-[15px] text-apple-black">Reviews</p>
              <p className="text-[12px] text-apple-gray mt-1">Approve customer reviews</p>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <div className="bg-ink-card border border-ink-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-apple-black text-[18px]">
                  Recent Bookings
                </h2>
                <Link
                  href="/admin/bookings"
                  className="text-[12px] text-gold hover:text-gold-light transition-colors flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <p className="text-apple-gray text-[14px] text-center py-8">
                  No bookings yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-ink rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                          <Car className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-apple-black">
                            {booking.vehicle.make} {booking.vehicle.model}
                          </p>
                          <p className="text-[11px] text-apple-gray">
                            {booking.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-semibold text-gold">
                          ${(booking.totalAmount / 100).toFixed(0)}
                        </p>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-500/10 text-green-500"
                              : booking.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-apple-gray/10 text-apple-gray"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Contact Submissions */}
            <div className="bg-ink-card border border-ink-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-apple-black text-[18px]">
                  Contact Submissions
                </h2>
                <Link
                  href="/admin/contacts"
                  className="text-[12px] text-gold hover:text-gold-light transition-colors flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentContacts.length === 0 ? (
                <p className="text-apple-gray text-[14px] text-center py-8">
                  No contact submissions yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-start gap-3 p-3 bg-ink rounded-xl"
                    >
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-apple-black truncate">
                          {contact.name}
                        </p>
                        <p className="text-[11px] text-apple-gray truncate">
                          {contact.subject}
                        </p>
                        <p className="text-[11px] text-apple-gray mt-1 line-clamp-1">
                          {contact.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="mt-8 bg-ink-card border border-ink-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-apple-black text-[18px]">
                Revenue (Last 30 Days)
              </h2>
              <span className="text-[12px] text-apple-gray">
                {dailyRevenue.filter((d) => d.revenue > 0).length} days with sales
              </span>
            </div>
            <div className="flex items-end gap-1 h-40">
              {dailyRevenue.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center gap-1 group"
                  title={`${d.date}: $${(d.revenue / 100).toFixed(0)}`}
                >
                  <div
                    className="w-full bg-gold/20 rounded-sm transition-all group-hover:bg-gold/40"
                    style={{
                      height: `${(d.revenue / maxDailyRevenue) * 100}%`,
                      minHeight: d.revenue > 0 ? 2 : 0,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-apple-gray">
              <span>{dailyRevenue[0]?.date.slice(5)}</span>
              <span>{dailyRevenue[dailyRevenue.length - 1]?.date.slice(5)}</span>
            </div>
          </div>

          {/* Top Vehicles */}
          <div className="mt-8 bg-ink-card border border-ink-border rounded-2xl p-6">
            <h2 className="font-semibold text-apple-black text-[18px] mb-6">
              Most Booked Vehicles
            </h2>
            {topVehicles.length === 0 ? (
              <p className="text-apple-gray text-[14px] text-center py-8">
                No booking data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {topVehicles.map((v, i) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-3 bg-ink rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-apple-gray w-4">
                        {i + 1}
                      </span>
                      <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                        <Car className="w-4 h-4 text-gold" />
                      </div>
                      <p className="text-[13px] font-medium text-apple-black">
                        {v.make} {v.model}
                      </p>
                    </div>
                    <span className="text-[13px] font-semibold text-gold">
                      {v._count.bookings} bookings
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-ink-card border border-ink-border rounded-2xl p-6">
            <h2 className="font-semibold text-apple-black text-[18px] mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.12em] px-5 py-3 rounded-lg hover:bg-gold-light transition-colors"
              >
                <Car className="w-4 h-4" />
                View Fleet
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 border border-gold/50 text-gold text-[12px] font-semibold uppercase tracking-[0.12em] px-5 py-3 rounded-lg hover:bg-gold/10 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                New Booking
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
