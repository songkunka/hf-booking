import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRoom } from "@/data/rooms";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

const STATUSES = ["ทั้งหมด", "pending", "confirmed", "checked-in", "checked-out", "cancelled"];
const statusColor: Record<string, string> = {
  confirmed: "bg-primary/15 text-primary",
  pending: "bg-accent text-accent-foreground",
  "checked-in": "bg-chart-2/20 text-chart-2",
  "checked-out": "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

// Map status to Thai labels if needed, or just capitalize
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function AdminBookings() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Auto refresh every 10 seconds
  });

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "ทั้งหมด" && b.status !== statusFilter) return false;
    const searchString = `${b.booking_ref} ${b.guest_first_name} ${b.guest_last_name}`.toLowerCase();
    if (q && !searchString.includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Bookings</p>
        <h1 className="font-serif text-4xl">การจองทั้งหมด</h1>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหารหัสจอง หรือชื่อแขก..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/50 text-foreground hover:bg-secondary"
              }`}
            >
              {s === "ทั้งหมด" ? s : capitalize(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 text-left text-muted-foreground border-b border-border">
            <tr>
              <th className="px-5 py-4 font-medium">รหัสจอง</th>
              <th className="px-5 py-4 font-medium">ชื่อแขก</th>
              <th className="px-5 py-4 font-medium">ห้องพัก</th>
              <th className="px-5 py-4 font-medium">เช็คอิน — เช็คเอาต์</th>
              <th className="px-5 py-4 font-medium">ยอดรวม</th>
              <th className="px-5 py-4 font-medium">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-20 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p>กำลังโหลดข้อมูล...</p>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">
                  ไม่พบรายการจองที่ตรงกับการค้นหา
                </td>
              </tr>
            ) : (
              filtered.map((b) => {
                const room = getRoom(b.room_id);
                return (
                  <tr key={b.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{b.booking_ref}</td>
                    <td className="px-5 py-4 font-medium">
                      {b.guest_first_name} {b.guest_last_name}
                      {b.guest_email && <div className="text-xs text-muted-foreground font-normal">{b.guest_email}</div>}
                    </td>
                    <td className="px-5 py-4">
                      {room ? room.name : b.room_id}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {b.check_in_date} <br/> <span className="text-xs">ถึง</span> {b.check_out_date}
                    </td>
                    <td className="px-5 py-4 font-medium">฿{b.total_price.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <Badge className={statusColor[b.status] || "bg-secondary text-foreground"} variant="outline">
                        {capitalize(b.status)}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
