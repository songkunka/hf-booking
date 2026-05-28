import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timer, CheckCircle2, ShieldCheck, CreditCard, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getRoom, HOTEL } from "@/data/rooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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
    meta: loaderData ? [{ title: `จอง ${loaderData.room.name} · ${HOTEL.name}` }] : [],
  }),
  component: BookingPage,
});

const guestSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  phone: z.string().min(9, "เบอร์โทรสั้นเกินไป"),
  requests: z.string().max(500, "ความยาวต้องไม่เกิน 500 ตัวอักษร").optional(),
  paymentMethod: z.string().min(1, "กรุณาเลือกวิธีการชำระเงิน"),
});

type GuestFormValues = z.infer<typeof guestSchema>;

function BookingPage() {
  const { room } = Route.useLoaderData();
  const { nights, guests } = Route.useSearch();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  
  const bookingRef = useMemo(
    () => `BK-${Math.floor(100000 + Math.random() * 900000)}`,
    [],
  );

  // 15-minute hold timer
  const [seconds, setSeconds] = useState(15 * 60);
  useEffect(() => {
    if (confirmed) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [confirmed]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const isTimeUp = seconds === 0;

  const subtotal = nights * room.price;
  const taxes = Math.round(subtotal * 0.07);
  const total = subtotal + taxes;

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      requests: "",
      paymentMethod: "card",
    },
  });

  const onSubmit = async (data: GuestFormValues) => {
    setIsSubmitting(true);
    
    // Default check-in to today and checkout based on nights for demo purposes
    // since the date picker doesn't pass dates yet.
    const checkIn = new Date();
    const checkOut = new Date(checkIn.getTime() + nights * 24 * 60 * 60 * 1000);

    // Generate a fresh booking ref each attempt to avoid duplicate key errors
    const ref = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    const payload = {
      booking_ref: ref,
      room_id: room.id,
      guest_first_name: data.firstName,
      guest_last_name: data.lastName,
      guest_email: data.email,
      guest_phone: data.phone,
      special_requests: data.requests || null,
      check_in_date: checkIn.toISOString().split("T")[0],
      check_out_date: checkOut.toISOString().split("T")[0],
      nights: nights,
      total_price: total,
      status: "pending"
    };

    try {
      const { error } = await supabase.from("bookings").insert(payload);
      
      if (error) {
        console.error("Supabase insert error:", JSON.stringify(error));
        toast.error(`เกิดข้อผิดพลาด: ${error.message || error.code || "Unknown error"}`);
        setIsSubmitting(false);
        return;
      }

      setSubmittedEmail(data.email);
      setConfirmed(true);
      toast.success(`ส่งอีเมลยืนยันไปยัง ${data.email} เรียบร้อยแล้ว`);
    } catch (err: unknown) {
      console.error("Booking error:", err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`เกิดข้อผิดพลาด: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <CheckCircle2 className="h-20 w-20 text-emerald-500" />
          <h1 className="mt-6 font-serif text-5xl">ยืนยันการจองเรียบร้อย</h1>
          <p className="mt-4 text-muted-foreground">
            ระบบได้ส่งใบยืนยันการจองไปยัง <span className="font-medium text-foreground">{submittedEmail}</span> แล้ว
          </p>

          <div className="mt-8 w-full overflow-hidden rounded-3xl border border-border bg-card text-left shadow-xl shadow-primary/5">
            <div className="border-b border-border bg-secondary/50 p-6 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm uppercase tracking-wider text-muted-foreground">หมายเลขการจอง</div>
                  <div className="mt-1 font-mono text-2xl font-bold">{bookingRef}</div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 px-3 py-1.5 text-sm">Confirmed</Badge>
              </div>
            </div>
            
            <div className="p-6 sm:px-8 sm:py-8">
              <div className="flex gap-5">
                <img src={room.image} alt={room.name} className="h-24 w-32 rounded-xl object-cover" />
                <div>
                  <h3 className="font-serif text-2xl leading-tight">{room.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {HOTEL.name}
                  </p>
                  <p className="mt-2 text-sm">
                    {nights} คืน · ผู้เข้าพัก {guests} ท่าน
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 rounded-2xl bg-secondary/30 p-5 sm:grid-cols-2">
                <div className="flex gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">เช็คอิน</div>
                    <div className="mt-1 text-sm text-muted-foreground">หลัง {HOTEL.checkInTime} น.</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">เช็คเอาต์</div>
                    <div className="mt-1 text-sm text-muted-foreground">ก่อน {HOTEL.checkOutTime} น.</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h4 className="font-medium">นโยบายการเข้าพักและการยกเลิก</h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {room.cancellation} โปรดแสดงหมายเลขการจอง <b>{bookingRef}</b> พร้อมบัตรประชาชนหรือพาสปอร์ตเมื่อเข้าเช็คอิน
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/">กลับสู่หน้าแรก</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/rooms">จองห้องอื่นเพิ่ม</Link>
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

        <div className={cn(
          "mt-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm w-fit transition-colors",
          seconds < 300 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        )}>
          <Timer className="h-4 w-4" />
          ระบบล็อกห้องนี้ให้คุณ {mm}:{ss}
        </div>

        <h1 className="mt-6 font-serif text-5xl">ยืนยันการจอง</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_420px]">
          <Form {...form}>
            <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
              <section>
                <h2 className="font-serif text-2xl">ข้อมูลผู้เข้าพัก</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ <span className="text-primary">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="สมชาย" disabled={isTimeUp} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>นามสกุล <span className="text-primary">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="ใจดี" disabled={isTimeUp} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>อีเมล <span className="text-primary">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@email.com" disabled={isTimeUp} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>เบอร์โทร <span className="text-primary">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="0812345678" disabled={isTimeUp} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="requests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>คำขอเพิ่มเติม (ไม่บังคับ)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="เช่น ขอเตียงเสริม / เช็คอินดึก" rows={3} disabled={isTimeUp} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl">วิธีการชำระเงิน</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  * โหมดเดโม่ — ยังไม่เชื่อมต่อจริง
                </p>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isTimeUp}
                          className="space-y-3"
                        >
                          <FormItem className="flex items-center space-y-0">
                            <FormControl>
                              <RadioGroupItem value="card" className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                              <CreditCard className="h-5 w-5 text-foreground/70" />
                              <div className="font-medium text-base">บัตรเครดิต / เดบิต</div>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-y-0">
                            <FormControl>
                              <RadioGroupItem value="promptpay" className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                              <ShieldCheck className="h-5 w-5 text-foreground/70" />
                              <div className="font-medium text-base">PromptPay QR</div>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-y-0">
                            <FormControl>
                              <RadioGroupItem value="hotel" className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                              <ShieldCheck className="h-5 w-5 text-foreground/70" />
                              <div className="font-medium text-base">ชำระที่โรงแรม</div>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <Button type="submit" size="lg" className="w-full rounded-full py-6 text-base" disabled={isSubmitting || isTimeUp}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> กำลังดำเนินการ...
                  </>
                ) : (
                  `ยืนยันและชำระเงิน · ฿${total.toLocaleString()}`
                )}
              </Button>
            </form>
          </Form>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg shadow-primary/5">
              <div className="p-6">
                <div className="flex gap-4">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="h-24 w-28 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-primary font-medium">
                      {room.type}
                    </div>
                    <div className="mt-1.5 font-serif text-xl leading-tight">{room.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{HOTEL.name}</div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/30 p-6">
                <h3 className="font-medium mb-4">สรุปรายละเอียดการจอง</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ระยะเวลา</span>
                    <span className="font-medium">{nights} คืน</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ผู้เข้าพัก</span>
                    <span className="font-medium">{guests} ท่าน</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ราคา ({nights} คืน)</span>
                    <span className="font-medium">฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ภาษีมูลค่าเพิ่ม (7%)</span>
                    <span className="font-medium">฿{taxes.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                    <div>
                      <div className="text-base font-semibold">ยอดชำระสุทธิ</div>
                      <div className="text-xs text-muted-foreground mt-0.5">รวมภาษีแล้ว</div>
                    </div>
                    <span className="text-2xl font-bold text-primary">฿{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />

      {/* Timeout Alert Dialog */}
      <AlertDialog open={isTimeUp}>
        <AlertDialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center pt-4 pb-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <AlertDialogHeader className="mt-6 text-center">
              <AlertDialogTitle className="font-serif text-2xl text-center">หมดเวลาทำรายการ</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-base mt-2">
                ระบบได้ยกเลิกการล็อกห้องพักของคุณแล้วเนื่องจากหมดเวลา กรุณากลับไปเลือกห้องพักและทำรายการใหม่อีกครั้ง
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 w-full sm:justify-center">
              <AlertDialogAction asChild className="w-full sm:w-auto">
                <Link to="/rooms">กลับไปเลือกห้องพัก</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
