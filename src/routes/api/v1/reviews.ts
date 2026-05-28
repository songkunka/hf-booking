import { createAPIFileRoute } from "@tanstack/react-start/api";
import { createClient } from "@supabase/supabase-js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL as string;
  const key = process.env.VITE_SUPABASE_ANON_KEY as string;
  return createClient(url, key);
}

export const APIRoute = createAPIFileRoute("/api/v1/reviews")({
  GET: async ({ request }) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");

    const supabase = getSupabase();
    let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });

    if (roomId) {
      query = query.eq("room_id", roomId);
    }

    const { data, error } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
  },

  POST: async ({ request }) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json();
      const { roomId, guestName, rating, comment } = body;

      if (!roomId || !guestName || !rating) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
      }

      const supabase = getSupabase();
      const { data, error } = await supabase.from("reviews").insert([
        {
          room_id: roomId,
          guest_name: guestName,
          rating: Number(rating),
          comment: comment || null,
        }
      ]).select();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
      }

      return new Response(JSON.stringify({ success: true, data: data[0] }), { status: 201, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
    }
  }
});
