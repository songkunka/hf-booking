import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchBar } from "@/components/SearchBar";
import { RoomCard } from "@/components/RoomCard";
import { ROOMS, AMENITY_LABELS } from "@/data/rooms";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "ค้นหาที่พัก · Sànd" },
      { name: "description", content: "ค้นหาและกรองที่พักบูทีคทั่วไทย" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [price, setPrice] = useState<[number, number]>([1000, 8000]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [guests, setGuests] = useState(1);

  const toggleAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const filtered = useMemo(() => {
    return ROOMS.filter((r) => {
      if (r.price < price[0] || r.price > price[1]) return false;
      if (r.capacity < guests) return false;
      if (amenities.length && !amenities.every((a) => r.amenities.includes(a))) return false;
      return true;
    });
  }, [price, amenities, guests]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <div className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <SearchBar compact />
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        {/* Filters */}
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

        {/* Results */}
        <section>
          <div className="flex items-baseline justify-between">
            <h1 className="font-serif text-3xl">
              พบ {filtered.length} ที่พัก
            </h1>
            <select className="rounded-md border border-border bg-background px-3 py-1.5 text-sm">
              <option>แนะนำ</option>
              <option>ราคา: ต่ำ → สูง</option>
              <option>ราคา: สูง → ต่ำ</option>
              <option>คะแนนรีวิว</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              ไม่มีที่พักตรงเงื่อนไข ลองปรับตัวกรองดูครับ
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
