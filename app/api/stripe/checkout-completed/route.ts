import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

//apiVersion: "2026-06-24.dahlia",
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  // Verify the webhook signature
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

  // Only handle checkout.session.completed
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Parse the client_reference_id we set on the frontend
  // Format: "carbon__1day__20th-August-2026" or "carbon__2day__23rd-24th-July-2026"
  const clientRef = session.client_reference_id ?? "";
  const refParts = clientRef.split("__");        // split on double underscore
  const course = refParts[0] ?? null;            // "carbon" or "electrical"
  const daysStr = refParts[1] ?? null;           // "1day" or "2day"
  const days = daysStr ? parseInt(daysStr) : null;
  const dateRaw = refParts[2] ?? null;           // "20th-August-2026"

  const courseLabels: Record<string, string> = {
    carbon: "Carbon Awareness, Carbon Capture & Carbon Footprint Reporting",
    electrical: "Electrical Safety & Hazardous Voltage Awareness",
  };

  // Reconstruct human-readable date: "20th-August-2026" -> "20th August 2026"
  const dateStr = dateRaw ? dateRaw.replace(/-/g, " ") : null;

  // Get customer details from the session
  const customerName = session.customer_details?.name ?? null;
  const customerEmail = session.customer_details?.email ?? null;
  const amountPaid = session.amount_total ?? null; // in pence
  const paymentDate = new Date(event.created * 1000).toISOString();
  const stripePaymentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id ?? null;

  // Write to Supabase
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
      course_label: courseLabels[course ?? ""] ?? course,
      date: dateStr,
      days: days,
      amount_paid: amountPaid,
      stripe_payment_id: stripePaymentId,
      stripe_client_ref: clientRef,
      payment_date: paymentDate,
    });

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save attendee" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}