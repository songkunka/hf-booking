import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Timer, CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getRoom } from "@/data/rooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const searchSchema = z.object({
  nights: z.number().min(1).default(1),
  guests: z.number().min(1).default(2),
});

export const Route = createFileRoute("/booking/$id")({
  validateSearch: searchSchema,
  loader: ({ params }) => {
    const room = getRoom(params.id);
    if (!room) throw notFound();
    return { room };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `จอง ${loaderData.room.name} · Sànd` }]
      : [],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { room } = Route.useLoaderData();
  const { nights, guests } = Route.useSearch();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  // 15-minute hold timer
  const [seconds, setSeconds] = useState(15 * 60);
  useEffect(() => {
    if (confirmed) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [confirmed]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const subtotal = nights * room.price;
  const taxes = Math.round(subtotal * 0.07);
  const total = subtotal + taxes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
    toast.success("จองสำเร็จ! ส่งอีเมลยืนยันเรียบร้อย");
  };

  if (confirmed) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary" />
          <h1 className="mt-6 font-serif text-5xl">ยืนยันการจองแล้ว</h1>
          <p className="mt-3 text-muted-foreground">
            ส่งอีเมลยืนยันไปยังอีเมลของคุณแล้ว สามารถดูประวัติการจองได้ที่บัญชีของฉัน
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild>
              <Link to="/profile">ดูการจอง</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">กลับสู่หน้าแรก</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ to: "/rooms/$id", params: { id: room.id } })}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← กลับไปยังหน้าห้องพัก
        </button>

        <div className="mt-4 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary w-fit">
          <Timer className="h-4 w-4" />
          ระบบล็อกห้องนี้ให้คุณ {mm}:{ss}
        </div>

        <h1 className="mt-6 font-serif text-5xl">ยืนยันการจอง</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
          <form className="space-y-10" onSubmit={handleSubmit}>
            <section>
              <h2 className="font-serif text-2xl">ข้อมูลผู้เข้าพัก</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="ชื่อ" required>
                  <Input required placeholder="สมชาย" />
                </Field>
                <Field label="นามสกุล" required>
                  <Input required placeholder="ใจดี" />
                </Field>
                <Field label="อีเมล" required>
                  <Input type="email" required placeholder="you@email.com" />
                </Field>
                <Field label="เบอร์โทร" required>
                  <Input required placeholder="081-234-5678" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="คำขอเพิ่มเติม (ไม่บังคับ)">
                  <Textarea placeholder="เช่น ขอเตียงเสริม / เช็คอินดึก" rows={3} />
                </Field>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl">วิธีการชำระเงิน</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                * โหมดเดโม่ — ยังไม่เชื่อมต่อจริง (Stripe / Omise / PromptPay จะเปิดในรอบถัดไป)
              </p>
              <RadioGroup defaultValue="card" className="mt-4 space-y-2">
                <PayOption value="card" label="บัตรเครดิต / เดบิต" icon={<CreditCard className="h-4 w-4" />} />
                <PayOption value="promptpay" label="PromptPay QR" icon={<ShieldCheck className="h-4 w-4" />} />
                <PayOption value="hotel" label="ชำระที่โรงแรม" icon={<ShieldCheck className="h-4 w-4" />} />
              </RadioGroup>
            </section>

            <Button type="submit" size="lg" className="w-full">
              ยืนยันและชำระเงิน · ฿{total.toLocaleString()}
            </Button>
          </form>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-4">
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-20 w-24 rounded-lg object-cover"
                />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {room.type}
                  </div>
                  <div className="mt-1 font-serif text-lg leading-tight">{room.name}</div>
                  <div className="text-xs text-muted-foreground">{room.location}</div>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                <Row label="จำนวนคืน" value={`${nights} คืน`} />
                <Row label="ผู้เข้าพัก" value={`${guests} ท่าน`} />
                <Row label={`฿${room.price.toLocaleString()} × ${nights}`} value={`฿${subtotal.toLocaleString()}`} />
                <Row label="ภาษีและค่าบริการ (7%)" value={`฿${taxes.toLocaleString()}`} />
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-medium">
                  <span>รวมทั้งหมด</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm">
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function PayOption({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 hover:bg-secondary/50">
      <RadioGroupItem value={value} id={value} />
      <span className="flex items-center gap-2 text-sm">
        {icon}
        {label}
      </span>
    </label>
  );
}
