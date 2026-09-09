import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendCustomerConfirmation, sendAdminNotification } from "@/lib/email";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (!metadata) {
      console.warn("Webhook: no metadata in checkout session", session.id);
      return NextResponse.json({ received: true, skipped: "no metadata" });
    }

    const required = ["email", "vehicleId", "startDate", "endDate", "pickupLocation", "dropoffLocation"];
    const missing = required.filter((key) => !metadata[key]);
    if (missing.length > 0) {
      console.warn("Webhook: missing metadata fields", missing, session.id);
      return NextResponse.json({ received: true, skipped: "incomplete metadata" });
    }

    try {
      // Find or create user
      const user = await prisma.user.upsert({
        where: { email: metadata.email },
        update: {},
        create: {
          email: metadata.email,
          password: "",
          firstName: metadata.name?.trim()?.split(/\s+/)?.[0] || "",
          lastName: metadata.name?.trim()?.split(/\s+/)?.slice(1)?.join(" ") || "",
          phone: metadata.phone || "",
        },
      });

      // Idempotency: skip if booking already exists for this session
      const existing = await prisma.booking.findFirst({
        where: { stripeSessionId: session.id },
      });
      if (existing) {
        return NextResponse.json({ received: true, skipped: "already processed" });
      }

      // Create booking
      await prisma.booking.create({
        data: {
          userId: user.id,
          vehicleId: metadata.vehicleId,
          startDate: new Date(metadata.startDate),
          endDate: new Date(metadata.endDate),
          pickupLocation: metadata.pickupLocation,
          dropoffLocation: metadata.dropoffLocation,
          totalAmount: session.amount_total || 0,
          status: "confirmed",
          paymentStatus: "paid",
          stripeSessionId: session.id,
          notes: metadata.notes || "",
        },
      });

      // Send confirmation emails (non-blocking, fire-and-forget)
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: metadata.vehicleId },
      });

      const emailData = {
        vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : "Your Vehicle",
        startDate: metadata.startDate,
        endDate: metadata.endDate,
        pickupLocation: metadata.pickupLocation,
        totalAmount: session.amount_total || 0,
      };

      sendCustomerConfirmation({
        to: metadata.email,
        name: metadata.name || metadata.email,
        ...emailData,
      }).catch((err) => console.error("Failed to send customer email:", err));

      sendAdminNotification({
        customerEmail: metadata.email,
        customerName: metadata.name || metadata.email,
        ...emailData,
      }).catch((err) => console.error("Failed to send admin email:", err));
    } catch (error) {
      console.error("Failed to create booking from webhook:", error);
      return NextResponse.json(
        { error: "Failed to process booking" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
