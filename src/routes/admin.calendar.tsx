import { createFileRoute } from "@tanstack/react-router";
import { ROOMS } from "@/data/rooms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/calendar")({
  component: AdminCalendar,
});

// Generate next 14 days
function nextDays(n: number) {
  const start = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// Deterministic pseudo status per room/day
function statusFor(roomId: string, day: number): "free" | "booked" | "blocked" | "checkin" {
  const seed = roomId.charCodeAt(0) + day * 7;
  const v = seed % 11;
  if (v < 5) return "free";
  if (v < 8) return "booked";
  if (v === 8) return "checkin";
  return "blocked";
}

const colors: Record<string, string> = {
  free: "bg-background hover:bg-secondary",
  booked: "bg-primary/80 text-primary-foreground",
  checkin: "bg-chart-2/80 text-background",
  blocked: "bg-muted-foreground/30 text-muted-foreground line-through",
};

function AdminCalendar() {
  const days = nextDays(14);
  const labels = days.map((d, i) =>
    d.toLocaleDateString("th-TH", { day: "numeric", month: "short" }) + (i === 0 ? " (วันนี้)" : ""),
  );

  return (
    <div>
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Calendar</p>
        <h1 className="font-serif text-4xl">ปฏิทินสถานะห้องพัก</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          คลิกที่ช่องเพื่อเปลี่ยนสถานะ — บล็อกห้อง, ปลดล็อก หรือดูรายละเอียดการจอง
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-xs">
        <Legend color="bg-background border" label="ว่าง" />
        <Legend color="bg-primary/80" label="ถูกจอง" />
        <Legend color="bg-chart-2/80" label="เช็คอินวันนี้" />
        <Legend color="bg-muted-foreground/30" label="บล็อก" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-card px-3 py-3 text-left text-muted-foreground">
                ห้องพัก
              </th>
              {labels.map((l, i) => (
                <th key={i} className="px-2 py-3 text-center font-normal text-muted-foreground">
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROOMS.map((room) => (
              <tr key={room.id} className="border-t border-border">
                <td className="sticky left-0 z-10 bg-card px-3 py-2">
                  <div className="font-medium">{room.name}</div>
                  <div className="text-muted-foreground">{room.type}</div>
                </td>
                {days.map((_, i) => {
                  const s = statusFor(room.id, i);
                  return (
                    <td key={i} className="p-1">
                      <button
                        className={cn(
                          "h-10 w-full min-w-[44px] rounded-md border border-border text-[10px] transition",
                          colors[s],
                        )}
                        title={s}
                      >
                        {s === "booked" ? "•" : s === "checkin" ? "in" : s === "blocked" ? "×" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-block h-4 w-4 rounded-md border border-border", color)} />
      {label}
    </div>
  );
}
