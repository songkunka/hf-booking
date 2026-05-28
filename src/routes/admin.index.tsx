import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, BedDouble, CreditCard, Users, Loader2 } from "lucide-react";
import { getRoom } from "@/data/rooms";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const revenueData = [
  { day: "จ.", value: 8400 },
  { day: "อ.", value: 12200 },
  { day: "พ.", value: 9800 },
  { day: "พฤ.", value: 15400 },
  { day: "ศ.", value: 21800 },
  { day: "ส.", value: 28500 },
  { day: "อา.", value: 24100 },
];

const occupancyData = [
  { month: "ม.ค.", rate: 62 },
  { month: "ก.พ.", rate: 71 },
  { month: "มี.ค.", rate: 68 },
  { month: "เม.ย.", rate: 79 },
  { month: "พ.ค.", rate: 84 },
  { month: "มิ.ย.", rate: 88 },
];

function AdminDashboard() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-dashboard-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  const totalRevenue = bookings.reduce((s, b) => s + (b.total_price || 0), 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Dashboard
          </p>
          <h1 className="font-serif text-4xl">ภาพรวมประจำสัปดาห์</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="รายได้รวม" value={`฿${totalRevenue.toLocaleString()}`} delta="+18.2%" icon={<CreditCard className="h-4 w-4" />} />
        <Kpi label="ยอดจองใหม่" value={bookings.length.toString()} delta="+9" icon={<BedDouble className="h-4 w-4" />} />
        <Kpi label="อัตราเข้าพัก" value="84%" delta="+5%" icon={<ArrowUpRight className="h-4 w-4" />} />
        <Kpi label="แขกทั้งหมด" value={bookings.reduce((s, b) => s + (b.guests || 2), 0).toString()} delta="+12" icon={<Users className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <ChartCard title="รายได้รายวัน" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Occupancy Rate">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                dot={{ fill: "var(--color-primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="การจองล่าสุด" className="mt-8">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            กำลังโหลดข้อมูล...
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            ยังไม่มีการจอง
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bookings.slice(0, 5).map((b) => {
              const room = getRoom(b.room_id);
              return (
                <div key={b.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-3">
                    {room ? (
                      <img src={room.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">?</div>
                    )}
                    <div>
                      <div className="font-medium">{b.guest_first_name} {b.guest_last_name}</div>
                      <div className="text-xs text-muted-foreground">{room ? room.name : b.room_id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">฿{b.total_price?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground capitalize">{b.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ChartCard>
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="mt-2 font-serif text-3xl">{value}</div>
      <div className="mt-1 text-xs text-chart-2">{delta} จากสัปดาห์ที่แล้ว</div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-sm ${className}`}>
      <div className="mb-4 font-medium">{title}</div>
      {children}
    </div>
  );
}
