import { createAPIFileRoute } from "@tanstack/react-start/api";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { BookingConfirmationEmail } from "../../../../emails/BookingConfirmation"; // We will create this

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia" as any,
});

const resend = new Resend(process.env.RESEND_API_KEY);

function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL as string;
  const key = process.env.VITE_SUPABASE_ANON_KEY as string;
  return createClient(url, key);
}

export const APIRoute = createAPIFileRoute("/api/v1/webhooks/stripe")({
  POST: async ({ request }) => {
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return new Response("Missing signature or secret", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      const bodyText = await request.text();
      event = stripe.webhooks.constructEvent(bodyText, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = getSupabase();

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingRef = paymentIntent.metadata.bookingRef;

      if (bookingRef) {
        // Update booking status in Supabase
        const { data: booking, error } = await supabase
          .from("bookings")
          .update({ status: "paid" })
          .eq("booking_ref", bookingRef)
          .select()
          .single();

        if (error) {
          console.error(`Supabase update error: ${error.message}`);
        } else if (booking && booking.guest_email) {
          // Send Confirmation Email via Resend
          try {
            await resend.emails.send({
              from: "Booking <onboarding@resend.dev>", // Replace with verified domain in production
              to: [booking.guest_email],
              subject: `Booking Confirmation: ${bookingRef}`,
              react: BookingConfirmationEmail({ booking }),
            });
            console.log(`Confirmation email sent to ${booking.guest_email}`);
          } catch (emailErr) {
            console.error("Failed to send email:", emailErr);
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  },
});
