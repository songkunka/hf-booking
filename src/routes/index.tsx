import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Timer } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchBar } from "@/components/SearchBar";
import { RoomCard } from "@/components/RoomCard";
import { ROOMS } from "@/data/rooms";

export const Route = createFileRoute("/")({
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
            src={heroImg}
            alt="Boutique resort at golden hour"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/10 to-background" />

          <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-32 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.2em] text-background/90">
              Boutique stays · Real-time booking
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[1.05] text-background sm:text-6xl md:text-7xl">
              ที่พักที่ใช่ <br className="hidden sm:block" />
              <span className="italic">จองได้ทันที</span>
            </h1>
            <p className="mt-4 max-w-xl text-background/90">
              ค้นหาห้องว่างแบบเรียลไทม์ ราคาตรงไปตรงมา ยกเลิกฟรี
              พร้อมรีวิวจากแขกตัวจริง
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
        <Feature icon={<ShieldCheck />} title="ยกเลิกฟรี" desc="ยืดหยุ่นตามนโยบายโรงแรม" />
        <Feature icon={<Sparkles />} title="คัดสรรพิเศษ" desc="เฉพาะที่พักบูทีคคุณภาพ" />
      </section>

      {/* Featured rooms */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Featured stays
            </p>
            <h2 className="mt-2 font-serif text-4xl text-foreground sm:text-5xl">
              ที่พักที่กำลัง<span className="italic">มาแรง</span>
            </h2>
          </div>
          <Link
            to="/search"
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
              เป็นเจ้าของที่พัก? <br />
              ลงประกาศกับเราได้ <span className="italic">ฟรี</span>
            </h3>
            <p className="mt-3 text-muted-foreground">
              จัดการห้องพัก ราคา ปฏิทินสถานะ และคำสั่งจอง
              ผ่านแดชบอร์ดเดียวจบ
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              เปิด Admin Panel
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary"
            >
              สมัครสมาชิก
            </Link>
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
