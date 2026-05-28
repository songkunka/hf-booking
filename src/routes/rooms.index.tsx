import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchBar } from "@/components/SearchBar";
import { RoomCard } from "@/components/RoomCard";
import { AMENITY_LABELS, HOTEL } from "@/data/rooms";
import { useRooms } from "@/hooks/useRooms";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/rooms/")({
  head: () => ({
    meta: [
      { title: `ห้องพักทั้งหมด · ${HOTEL.name}` },
      { name: "description", content: `เลือกห้องพักที่ ${HOTEL.name} — ${HOTEL.tagline}` },
    ],
  }),
  component: RoomsListPage,
});

function RoomsListPage() {
  const { data: rooms = [], isLoading } = useRooms();
  const [price, setPrice] = useState<[number, number]>([1000, 8000]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [guests, setGuests] = useState(1);
  const [sort, setSort] = useState("recommended");

  const toggleAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const filtered = useMemo(() => {
    const list = [...rooms].filter((r) => {
      if (r.price < price[0] || r.price > price[1]) return false;
      if (r.capacity < guests) return false;
      if (amenities.length && !amenities.every((a) => r.amenities.includes(a))) return false;
      return true;
    });
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [rooms, price, amenities, guests, sort]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <div className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {HOTEL.name}
          </p>
          <h1 className="mt-1 font-serif text-4xl">เลือกห้องพักของคุณ</h1>
          <div className="mt-6">
            <SearchBar compact />
          </div>
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-8">
          <div>
            <h3 className="font-serif text-2xl">ช่วงราคา</h3>
            <div className="mt-4 text-sm text-muted-foreground">
              ฿{price[0].toLocaleString()} — ฿{price[1].toLocaleString()} / คืน
            </div>
            <Slider
              value={price}
              min={500}
              max={10000}
              step={100}
              onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
              className="mt-3"
            />
          </div>

          <div>
            <h3 className="font-serif text-2xl">จำนวนผู้เข้าพัก</h3>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setGuests(n)}
                  className={`h-9 w-9 rounded-full border text-sm transition ${
                    guests === n
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-secondary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl">สิ่งอำนวยความสะดวก</h3>
            <div className="mt-3 space-y-3">
              {Object.entries(AMENITY_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={amenities.includes(key)}
                    onCheckedChange={() => toggleAmenity(key)}
                  />
                  <Label htmlFor={key} className="text-sm font-normal">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-3xl">พบ {filtered.length} ห้องพัก</h2>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="recommended">แนะนำ</option>
              <option value="price-asc">ราคา: ต่ำ → สูง</option>
              <option value="price-desc">ราคา: สูง → ต่ำ</option>
              <option value="rating">คะแนนรีวิว</option>
            </select>
          </div>

          {isLoading ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-[400px] animate-pulse rounded-2xl bg-secondary/50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              ไม่มีห้องตรงเงื่อนไข ลองปรับตัวกรองดูครับ
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
              {filtered.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
