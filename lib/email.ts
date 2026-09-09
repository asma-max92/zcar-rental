import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendCustomerConfirmation({
  to,
  name,
  vehicleName,
  startDate,
  endDate,
  pickupLocation,
  totalAmount,
}: {
  to: string;
  name: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  totalAmount: number;
}) {
  if (!resend) {
    console.warn("Resend not configured — skipping customer email");
    return;
  }

  const from = process.env.EMAIL_FROM || "hello@zcarrentalmia.com";
  const safeName = escapeHtml(name);
  const safeVehicle = escapeHtml(vehicleName);
  const safeStart = escapeHtml(startDate);
  const safeEnd = escapeHtml(endDate);
  const safeLocation = escapeHtml(pickupLocation);
  const safeTotal = escapeHtml((totalAmount / 100).toFixed(2));

  await resend.emails.send({
    from,
    to,
    subject: `Booking Confirmed — ${vehicleName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Your Booking is Confirmed!</h1>
        <p>Hi ${safeName},</p>
        <p>Thank you for booking with Z Car Rental Miami. Here are your details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Vehicle</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeVehicle}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Pick-up</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeStart}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Return</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeEnd}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeLocation}</td></tr>
          <tr><td style="padding: 8px;"><strong>Total</strong></td><td style="padding: 8px;">$${safeTotal}</td></tr>
        </table>
        <p>We look forward to seeing you!</p>
        <p style="color: #666;">Z Car Rental Miami<br>(561) 947-6388</p>
      </div>
    `,
  });
}

export async function sendAdminNotification({
  customerEmail,
  customerName,
  vehicleName,
  startDate,
  endDate,
  pickupLocation,
  totalAmount,
}: {
  customerEmail: string;
  customerName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  totalAmount: number;
}) {
  if (!resend) {
    console.warn("Resend not configured — skipping admin email");
    return;
  }

  const from = process.env.EMAIL_FROM || "hello@zcarrentalmia.com";
  const adminEmail = process.env.ADMIN_EMAIL;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not set — skipping admin notification");
    return;
  }

  const safeCustomerName = escapeHtml(customerName);
  const safeCustomerEmail = escapeHtml(customerEmail);
  const safeVehicle = escapeHtml(vehicleName);
  const safeStart = escapeHtml(startDate);
  const safeEnd = escapeHtml(endDate);
  const safeLocation = escapeHtml(pickupLocation);
  const safeTotal = escapeHtml((totalAmount / 100).toFixed(2));

  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `New Booking — ${vehicleName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">New Booking Received</h1>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Customer</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeCustomerName} (${safeCustomerEmail})</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Vehicle</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeVehicle}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Pick-up</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeStart}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Return</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeEnd}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeLocation}</td></tr>
          <tr><td style="padding: 8px;"><strong>Total</strong></td><td style="padding: 8px;">$${safeTotal}</td></tr>
        </table>
        <p><a href="${baseUrl}/admin/bookings" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">View in Admin</a></p>
      </div>
    `,
  });
}
