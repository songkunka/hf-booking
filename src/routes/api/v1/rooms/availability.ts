import { createAPIFileRoute } from "@tanstack/react-start/api";
import { createClient } from "@supabase/supabase-js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
};

export const APIRoute = createAPIFileRoute("/api/v1/rooms/availability")({
  GET: async ({ request }) => {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const checkIn = url.searchParams.get("check_in");
    const checkOut = url.searchParams.get("check_out");
    const guestsParam = url.searchParams.get("guests");
    const guests = guestsParam ? parseInt(guestsParam, 10) : 1;

    if (!checkIn || !checkOut) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required query parameters: check_in, check_out",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        },
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Fetch rooms from Supabase instead of static ROOMS array
    const url = "https://iqktqhgnnivhygrytous.supabase.co";
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3RxaGdubml2aHlncnl0b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NDg2MTEsImV4cCI6MjA5NTUyNDYxMX0.epILdTsggdB-rOZI5pPTvW0ofj7YAsZ0-WeIpWecuuA";
    const supabase = createClient(url, key);

    const { data: rooms, error } = await supabase
      .from("rooms")
      .select("*")
      .gte("capacity", guests);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
      );
    }

    // Filter rooms by guest capacity
    const available = (rooms || []).map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      price_per_night: r.price,
      total_price: r.price * nights,
      capacity: r.capacity,
      beds: r.beds,
      size: r.size,
      rating: r.rating,
      reviews_count: r.reviews_count,
      amenities: r.amenities,
      description: r.description,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          check_in: checkIn,
          check_out: checkOut,
          nights,
          guests,
          rooms: available,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      },
    );
  },
});
