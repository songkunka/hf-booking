import { createAPIFileRoute } from "@tanstack/react-start/api";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia" as any, // Using type assertion to avoid TS errors on version string
});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
};

export const APIRoute = createAPIFileRoute("/api/v1/create-payment-intent")({
  POST: async ({ request }) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json();
      const { amount, currency = "thb", bookingRef } = body;

      if (!amount) {
        return new Response(JSON.stringify({ error: "Amount is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }

      // Create a PaymentIntent with the order amount and currency
      // Stripe expects amount in the smallest currency unit (e.g., satang for THB)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), 
        currency,
        payment_method_types: ['card', 'promptpay'],
        metadata: {
          bookingRef: bookingRef || "",
        },
      });

      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }
  },
});
