import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { CalendarIcon, Star, Users, Maximize, Bed } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AMENITY_LABELS, MOCK_REVIEWS, HOTEL } from "@/data/rooms";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/rooms/$id")({
  loader: async ({ params }) => {
    const { data: room, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", params.id)
      .single();
      
    if (error || !room) throw notFound();
    return { room };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.room.name} · HotelFlow` },
          { name: "description", content: loaderData.room.description },
          { property: "og:title", content: loaderData.room.name },
          { property: "og:image", content: loaderData.room.image },
        ]
      : [],
  }),
  component: RoomDetail,
});

function RoomDetail() {
  const { room } = Route.useLoaderData();
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const nights =
    range?.from && range?.to ? Math.max(1, differenceInDays(range.to, range.from)) : 0;
  const subtotal = nights * room.price;
  const taxes = Math.round(subtotal * 0.07);
  const total = subtotal + taxes;

  const reviews = MOCK_REVIEWS.filter((r) => r.roomId === room.id);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Gallery */}
        <div className="grid gap-2 overflow-hidden rounded-3xl md:grid-cols-3 md:gap-3">
          <img
            src={room.gallery[0]}
            alt={room.name}
            width={1280}
            height={960}
            className="aspect-[4/3] w-full object-cover md:col-span-2 md:aspect-auto md:h-[480px]"
          />
          <div className="hidden flex-col gap-3 md:flex">
            <img
              src={room.gallery[1]}
              alt=""
              loading="lazy"
              className="h-[234px] w-full object-cover"
            />
            <img
              src={room.gallery[2]}
              alt=""
              loading="lazy"
              className="h-[234px] w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Details */}
          <div>
            <div className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              {room.type}
            </div>
            <h1 className="mt-2 font-serif text-5xl leading-tight text-foreground">
              {room.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{HOTEL.name}</span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" /> {room.rating} ·{" "}
                {room.reviewsCount} รีวิว
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6">
              <Stat icon={<Users className="h-4 w-4" />} label="เข้าพักสูงสุด" value={`${room.capacity} ท่าน`} />
              <Stat icon={<Bed className="h-4 w-4" />} label="เตียง" value={room.beds} />
              <Stat icon={<Maximize className="h-4 w-4" />} label="ขนาดห้อง" value={`${room.size} ตร.ม.`} />
            </div>

            <section className="mt-8">
              <h2 className="font-serif text-2xl">เกี่ยวกับห้องนี้</h2>
              <p className="mt-3 leading-relaxed text-foreground/80">{room.description}</p>
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">สิ่งอำนวยความสะดวก</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {room.amenities.map((a: string) => (
                  <div key={a} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
                    {AMENITY_LABELS[a] ?? a}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">นโยบายการยกเลิก</h2>
              <p className="mt-2 text-foreground/80">{room.cancellation}</p>
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">รีวิวจากแขก ({reviews.length})</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {reviews.length === 0 && (
                  <div className="text-muted-foreground">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวสิ!</div>
                )}
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{r.author}</div>
                      <div className="inline-flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        {r.rating}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{r.date}</div>
                    <p className="mt-3 text-sm text-foreground/80">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-primary/5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-3xl">฿{room.price.toLocaleString()}</span>
                  <span className="ml-1 text-sm text-muted-foreground">/ คืน</span>
                </div>
                <div className="inline-flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  {room.rating}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left text-sm hover:bg-secondary/50">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {range?.from
                        ? `${format(range.from, "d MMM")}${range.to ? ` — ${format(range.to, "d MMM")}` : ""}`
                        : "เลือกวันเช็คอิน — เช็คเอาต์"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      numberOfMonths={1}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
                  <span>ผู้เข้าพัก</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border"
                    >
                      −
                    </button>
                    <span className="w-4 text-center">{guests}</span>
                    <button
                      onClick={() => setGuests(Math.min(room.capacity, guests + 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {nights > 0 && (
                <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                  <Row label={`฿${room.price.toLocaleString()} × ${nights} คืน`} value={`฿${subtotal.toLocaleString()}`} />
                  <Row label="ภาษีและค่าบริการ (7%)" value={`฿${taxes.toLocaleString()}`} />
                  <Row label="รวมทั้งหมด" value={`฿${total.toLocaleString()}`} bold />
                </div>
              )}

              <Button asChild size="lg" className="mt-5 w-full">
                <Link
                  to="/booking/$id"
                  params={{ id: room.id }}
                  search={{ nights: nights || 1, guests }}
                >
                  จองห้องนี้
                </Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                ยังไม่มีการเรียกเก็บเงิน — ระบบจะล็อกห้องไว้ให้ 15 นาที
              </p>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between", bold && "pt-2 text-base font-medium text-foreground")}>
      <span className={cn(!bold && "text-muted-foreground")}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
