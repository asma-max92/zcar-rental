import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Total revenue (paid bookings only)
    const revenueResult = await prisma.booking.aggregate({
      where: { paymentStatus: "paid" },
      _sum: { totalAmount: true },
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // Total bookings
    const totalBookings = await prisma.booking.count();

    // Bookings by status
    const pendingBookings = await prisma.booking.count({
      where: { status: "pending" },
    });
    const confirmedBookings = await prisma.booking.count({
      where: { status: "confirmed" },
    });
    const cancelledBookings = await prisma.booking.count({
      where: { status: "cancelled" },
    });

    // Revenue by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const recentBookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        paymentStatus: "paid",
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const revenueByDay: Record<string, number> = {};
    for (const booking of recentBookings) {
      const date = booking.createdAt.toISOString().split("T")[0];
      revenueByDay[date] = (revenueByDay[date] || 0) + booking.totalAmount;
    }

    // Fill in missing days with 0
    const dailyRevenue = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      dailyRevenue.push({
        date: dateStr,
        revenue: revenueByDay[dateStr] || 0,
      });
    }

    // Vehicle utilization (bookings per vehicle)
    const vehicleStats = await prisma.vehicle.findMany({
      select: {
        id: true,
        make: true,
        model: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: {
        bookings: { _count: "desc" },
      },
      take: 10,
    });

    // Recent bookings
    const latestBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        vehicle: { select: { make: true, model: true } },
      },
    });

    return NextResponse.json({
      totalRevenue,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      dailyRevenue,
      vehicleStats: vehicleStats.map((v) => ({
        id: v.id,
        name: `${v.make} ${v.model}`,
        bookings: v._count.bookings,
      })),
      latestBookings: latestBookings.map((b) => ({
        id: b.id,
        customer: `${b.user.firstName ?? ""} ${b.user.lastName ?? ""}`.trim() || b.user.email,
        vehicle: `${b.vehicle.make} ${b.vehicle.model}`,
        totalAmount: b.totalAmount,
        status: b.status,
        paymentStatus: b.paymentStatus,
        createdAt: b.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
