import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Timer, MapPin, Star } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchBar } from "@/components/SearchBar";
import { RoomCard } from "@/components/RoomCard";
import { ROOMS, HOTEL } from "@/data/rooms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${HOTEL.name} · จองห้องพักริมน้ำเชียงใหม่` },
      { name: "description", content: HOTEL.tagline },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[560px] w-full overflow-hidden">
          <img
            src={HOTEL.heroImage}
            alt={HOTEL.name}
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/10 to-background" />

          <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-32 sm:px-6 lg:px-8">
            <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-background/90">
              <MapPin className="h-3.5 w-3.5" />
              เชียงใหม่ · ริมแม่น้ำปิง
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[1.05] text-background sm:text-6xl md:text-7xl">
              Hotel<span className="text-primary">Flow</span> <br className="hidden sm:block" />
              <span className="italic">Riverside Resort</span>
            </h1>
            <p className="mt-4 max-w-xl text-background/90">
              บูทีครีสอร์ตเพียง {HOTEL.totalRoomTypes} ประเภทห้องพัก
              คัดสรรเพื่อความเป็นส่วนตัว จองห้องว่างได้แบบเรียลไทม์
            </p>
          </div>
        </div>

        <div className="mx-auto -mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto mt-16 grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        <Feature icon={<Timer />} title="จองทันใจ" desc="ห้องว่างอัปเดตเรียลไทม์ ไม่จองซ้อน" />
        <Feature icon={<ShieldCheck />} title="ยกเลิกฟรี" desc="ยืดหยุ่นตามนโยบายห้องพัก" />
        <Feature
          icon={<Star />}
          title={`${HOTEL.rating} / 5`}
          desc={`จากแขก ${HOTEL.reviewsCount.toLocaleString()} รีวิว`}
        />
      </section>

      {/* About */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              เกี่ยวกับเรา
            </p>
            <h2 className="mt-2 font-serif text-4xl text-foreground sm:text-5xl">
              ที่พักของคุณ <br />
              <span className="italic">ริมสายน้ำปิง</span>
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/80">
              HotelFlow คือบูทีครีสอร์ตขนาดเล็ก
              ที่ตั้งใจคัดสรรประสบการณ์การพักผ่อนแบบเงียบสงบ
              ท่ามกลางสวนเขียวขจีและสายน้ำที่ไหลผ่านตลอดวัน
            </p>
          </div>
          <ul className="grid gap-3">
            {HOTEL.highlights.map((h) => (
              <li
                key={h}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Room types */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Room Types
            </p>
            <h2 className="mt-2 font-serif text-4xl text-foreground sm:text-5xl">
              เลือก<span className="italic">ห้องพัก</span>ของคุณ
            </h2>
          </div>
          <Link
            to="/rooms"
            className="hidden items-center gap-1 text-sm text-foreground hover:text-primary md:flex"
          >
            ดูทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROOMS.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 rounded-3xl bg-secondary/60 p-8 md:grid-cols-2 md:p-14">
          <div>
            <h3 className="font-serif text-4xl leading-tight text-foreground">
              พร้อมเช็คอินแล้ว? <br />
              จองวันที่ใช่ของคุณ <span className="italic">วันนี้</span>
            </h3>
            <p className="mt-3 text-muted-foreground">
              ระบบจะล็อกห้องไว้ให้ 15 นาทีระหว่างกรอกข้อมูล
              ไม่ต้องสมัครสมาชิก
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              to="/rooms"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              เริ่มจองห้องพัก
            </Link>
            <a
              href={`tel:${HOTEL.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary"
            >
              โทรจองโดยตรง
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="font-medium text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}
