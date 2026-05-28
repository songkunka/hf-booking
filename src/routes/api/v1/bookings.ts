import { createAPIFileRoute } from "@tanstack/react-start/api";
import { createClient } from "@supabase/supabase-js";
import { ROOMS } from "@/data/rooms";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
};

function getSupabase() {
  const url =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
    "https://iqktqhgnnivhygrytous.supabase.co";
  let key =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3RxaGdubml2aHlncnl0b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NDg2MTEsImV4cCI6MjA5NTUyNDYxMX0.epILdTsggdB-rOZI5pPTvW0ofj7YAsZ0-WeIpWecuuA";
  
  if (typeof key === "string" && !key.startsWith("eyJ")) {
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3RxaGdubml2aHlncnl0b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NDg2MTEsImV4cCI6MjA5NTUyNDYxMX0.epILdTsggdB-rOZI5pPTvW0ofj7YAsZ0-WeIpWecuuA";
  }

  return createClient(url, key);
}

function getRoom(id: string) {
  return ROOMS.find((r) => r.id === id);
}

export const APIRoute = createAPIFileRoute("/api/v1/bookings")({
  // GET — list all bookings or fetch a single one by ?id=BK-XXXXX
  GET: async ({ request }) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const bookingId = url.searchParams.get("id");

    const supabase = getSupabase();

    if (bookingId) {
      // Single booking lookup
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_ref", bookingId)
        .maybeSingle();

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
        );
      }

      if (!data) {
        return new Response(
          JSON.stringify({ success: false, error: "Booking not found" }),
          { status: 404, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
        );
      }

      const room = getRoom(data.room_id);
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            id: data.booking_ref,
            roomId: data.room_id,
            roomName: room?.name || data.room_id,
            guest: `${data.guest_first_name} ${data.guest_last_name}`,
            email: data.guest_email,
            phone: data.guest_phone,
            checkIn: data.check_in_date,
            checkOut: data.check_out_date,
            nights: data.nights,
            total: data.total_price,
            status: data.status,
            createdAt: data.created_at,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
      );
    }

    // List all bookings
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
      );
    }

    const bookings = (data || []).map((b) => {
      const room = getRoom(b.room_id);
      return {
        id: b.booking_ref,
        roomId: b.room_id,
        roomName: room?.name || b.room_id,
        guest: `${b.guest_first_name} ${b.guest_last_name}`,
        checkIn: b.check_in_date,
        checkOut: b.check_out_date,
        nights: b.nights,
        total: b.total_price,
        status: b.status,
      };
    });

    return new Response(
      JSON.stringify({ success: true, data: bookings }),
      { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
    );
  },

  // POST — create a new booking
  POST: async ({ request }) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
      );
    }

    const { roomId, guest, checkIn, checkOut, guests } = body as {
      roomId?: string;
      guest?: string;
      checkIn?: string;
      checkOut?: string;
      guests?: number;
    };

    if (!roomId || !guest || !checkIn || !checkOut) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: roomId, guest, checkIn, checkOut",
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
      );
    }

    const room = getRoom(roomId);
    if (!room) {
      return new Response(
        JSON.stringify({ success: false, error: `Room '${roomId}' not found` }),
        { status: 404, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
    const total = room.price * nights;

    // Parse guest name
    const nameParts = (guest as string).trim().split(/\s+/);
    const firstName = nameParts[0] || guest;
    const lastName = nameParts.slice(1).join(" ") || "";

    const bookingRef = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    const supabase = getSupabase();
    const payload = {
      booking_ref: bookingRef,
      room_id: roomId,
      guest_first_name: firstName,
      guest_last_name: lastName,
      guest_email: (body.email as string) || "",
      guest_phone: (body.phone as string) || "",
      special_requests: (body.specialRequests as string) || null,
      check_in_date: checkIn,
      check_out_date: checkOut,
      nights,
      total_price: total,
      status: "confirmed",
    };

    const { error } = await supabase.from("bookings").insert(payload);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: bookingRef,
          roomId,
          roomName: room.name,
          guest,
          checkIn,
          checkOut,
          nights,
          total,
          status: "Confirmed",
        },
      }),
      { status: 201, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
    );
  },
});
