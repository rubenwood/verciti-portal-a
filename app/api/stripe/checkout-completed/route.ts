import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/app/api/send-email/send-email";
import { generateCustomerEmailTemplate, generateInternalEmailTemplate } from "@/app/api/stripe/checkout-completed/email-templates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // ── Parse client_reference_id ─────────────────────────────────────────────
  // Format: "carbon__1day__20th-August-2026" or "carbon__2day__23rd-24th-July-2026"
  const clientRef = session.client_reference_id ?? "";
  const refParts = clientRef.split("__");
  const course = refParts[0] ?? null;
  const daysStr = refParts[1] ?? null;
  const days = daysStr ? parseInt(daysStr) : null;
  const dateRaw = refParts[2] ?? null;
  const dateStr = dateRaw ? dateRaw.replace(/-/g, " ") : null;

  const courseLabels: Record<string, string> = {
    carbon: "Carbon Awareness, Carbon Capture & Carbon Footprint Reporting",
    electrical: "Electrical Safety & Hazardous Voltage Awareness",
  };
  const courseLabel = courseLabels[course ?? ""] ?? course;

  // ── Customer details ──────────────────────────────────────────────────────
  const customerName = session.customer_details?.name ?? null;
  const customerEmail = session.customer_details?.email ?? null;
  const amountPaid = session.amount_total ?? null;
  const paymentDate = new Date(event.created * 1000).toISOString();
  const stripePaymentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id ?? null;

  // ── Quantity from line items ──────────────────────────────────────────────
  let quantity: number | null = null;
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    quantity = lineItems.data[0]?.quantity ?? null;
  } catch (err) {
    console.error("Failed to fetch line items:", err);
  }

  // ── Write to Supabase ─────────────────────────────────────────────────────
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
    process.env.SUPABASE_SEC_TEST_KEY!
  );

  const { error } = await supabase
    .from("training_course_attendees")
    .insert({
      name: customerName,
      email: customerEmail,
      course: course,
      course_label: courseLabel,
      date: dateStr,
      days: days,
      quantity: quantity,
      amount_paid: amountPaid,
      stripe_payment_id: stripePaymentId,
      stripe_client_ref: clientRef,
      payment_date: paymentDate,
    });

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save attendee" }, { status: 500 });
  }

  // ── Send emails ───────────────────────────────────────────────────────────
  const daysLabel = days === 1 ? "1 day" : "2 days";
  const seatsLabel = quantity === 1 ? "1 seat" : `${quantity} seats`;
  const amountLabel = amountPaid ? `£${(amountPaid / 100).toFixed(2)}` : "—";

  // Confirmation to customer
  if (customerEmail) {
    const customerHtml = generateCustomerEmailTemplate({
      customerName,
      customerEmail,
      courseLabel,
      dateStr,
      daysLabel,
      seatsLabel,
      amountLabel
    });

    await sendEmail(
      "info@verciti.com",
      customerEmail,
      "info@verciti.com",
      `Booking Confirmed — ${courseLabel}`,
      customerHtml
    );
  }

  // Internal notification to Verciti
  const internalHtml = generateInternalEmailTemplate({
    customerName,
    customerEmail,
    courseLabel,
    dateStr,
    daysLabel,
    seatsLabel,
    amountLabel
  });

  await sendEmail(
    "developer@verciti.com",
    "info@verciti.com",
    customerEmail ?? "info@verciti.com",
    `New Booking — ${customerName ?? customerEmail} — ${courseLabel}`,
    internalHtml
  );

  return NextResponse.json({ received: true });
}