import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MOCK_BOOKINGS, getRoom } from "@/data/rooms";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "บัญชีของฉัน · Sànd" }] }),
  component: ProfilePage,
});

const statusColor: Record<string, string> = {
  Confirmed: "bg-primary/15 text-primary",
  Pending: "bg-accent text-accent-foreground",
  "Checked-in": "bg-chart-2/20 text-chart-2",
  "Checked-out": "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 font-serif text-2xl text-primary">
            ก
          </div>
          <div>
            <h1 className="font-serif text-4xl">สวัสดี, คุณกาญจน์</h1>
            <p className="text-sm text-muted-foreground">guest@example.com</p>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="mt-10">
          <TabsList>
            <TabsTrigger value="bookings">การจอง</TabsTrigger>
            <TabsTrigger value="profile">ข้อมูลส่วนตัว</TabsTrigger>
            <TabsTrigger value="favorites">รายการโปรด</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6 space-y-4">
            {MOCK_BOOKINGS.map((b) => {
              const room = getRoom(b.roomId)!;
              return (
                <div
                  key={b.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    className="h-24 w-full rounded-lg object-cover sm:w-32"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-serif text-lg">{room.name}</div>
                        <div className="text-xs text-muted-foreground">{room.location} · {b.id}</div>
                      </div>
                      <Badge className={statusColor[b.status]}>{b.status}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{b.checkIn} → {b.checkOut}</span>
                      <span>{b.nights} คืน</span>
                      <span className="text-foreground">฿{b.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
              จะเปิดให้แก้ไขชื่อ, อีเมล, รหัสผ่าน หลังเชื่อมต่อระบบสมาชิก
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
              ยังไม่มีรายการโปรด ลองค้นหาที่พักที่ใช่ดูครับ
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}
