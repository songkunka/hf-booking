import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchBar } from "@/components/SearchBar";
import { RoomCard } from "@/components/RoomCard";
import { HOTEL } from "@/data/rooms";
import { useRooms } from "@/hooks/useRooms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${HOTEL.name} · จองห้องพัก` },
      { name: "description", content: HOTEL.tagline },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: rooms = [], isLoading } = useRooms();

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
          <img
            src={HOTEL.heroImage}
            alt={HOTEL.name}
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background/90" />

          <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 text-center items-center">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              เชียงใหม่
            </p>
            <h1 className="mt-6 max-w-4xl font-serif text-6xl leading-tight text-white sm:text-7xl md:text-8xl">
              Hotel<span className="text-primary">Flow</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-light text-white/90">
              {HOTEL.tagline}
            </p>
          </div>
        </div>

        <div className="mx-auto -mt-24 max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-2xl bg-background p-2 shadow-2xl shadow-black/5 border border-border">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Room types */}
      <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8 mb-32">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
              ห้องพักของเรา
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              เลือกห้องพักที่เหมาะกับสไตล์การพักผ่อนของคุณ
            </p>
          </div>
          <Link
            to="/rooms"
            className="hidden items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 md:flex transition-colors"
          >
            ดูห้องพักทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.slice(0, 4).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
        
        <div className="mt-12 flex justify-center md:hidden">
          <Link
            to="/rooms"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary"
          >
            ดูห้องพักทั้งหมด
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
