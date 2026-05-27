import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { MOCK_BOOKINGS, getRoom } from "@/data/rooms";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

const STATUSES = ["ทั้งหมด", "Pending", "Confirmed", "Checked-in", "Checked-out", "Cancelled"];
const statusColor: Record<string, string> = {
  Confirmed: "bg-primary/15 text-primary",
  Pending: "bg-accent text-accent-foreground",
  "Checked-in": "bg-chart-2/20 text-chart-2",
  "Checked-out": "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

function AdminBookings() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ทั้งหมด");

  const filtered = MOCK_BOOKINGS.filter((b) => {
    if (status !== "ทั้งหมด" && b.status !== status) return false;
    if (q && !`${b.id} ${b.guest}`.toLowerCase().includes(q.toLowerCase())) return false;
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
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                status === s ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">รหัส</th>
              <th className="px-5 py-3 font-medium">แขก</th>
              <th className="px-5 py-3 font-medium">ห้องพัก</th>
              <th className="px-5 py-3 font-medium">เช็คอิน — เช็คเอาต์</th>
              <th className="px-5 py-3 font-medium">ยอด</th>
              <th className="px-5 py-3 font-medium">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const room = getRoom(b.roomId)!;
              return (
                <tr key={b.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{b.id}</td>
                  <td className="px-5 py-4 font-medium">{b.guest}</td>
                  <td className="px-5 py-4">{room.name}</td>
                  <td className="px-5 py-4">{b.checkIn} → {b.checkOut}</td>
                  <td className="px-5 py-4">฿{b.total.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <Badge className={statusColor[b.status]}>{b.status}</Badge>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">ไม่พบรายการจอง</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
