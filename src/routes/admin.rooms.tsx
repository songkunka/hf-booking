import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ROOMS } from "@/data/rooms";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/rooms")({
  component: AdminRooms,
});

function AdminRooms() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Rooms</p>
          <h1 className="font-serif text-4xl">จัดการห้องพัก</h1>
        </div>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> เพิ่มประเภทห้อง
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">ห้องพัก</th>
              <th className="px-5 py-3 font-medium">ประเภท</th>
              <th className="px-5 py-3 font-medium">รับสูงสุด</th>
              <th className="px-5 py-3 font-medium">ราคา / คืน</th>
              <th className="px-5 py-3 font-medium">จำนวนห้อง</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {ROOMS.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={r.image} alt="" className="h-10 w-14 rounded-md object-cover" />
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.beds} · {r.size} ตร.ม.</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">{r.type}</td>
                <td className="px-5 py-4">{r.capacity} ท่าน</td>
                <td className="px-5 py-4">฿{r.price.toLocaleString()}</td>
                <td className="px-5 py-4">{Math.floor(Math.random() * 6) + 3}</td>
                <td className="px-5 py-4 text-right">
                  <button className="mr-1 rounded-md p-2 hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                  <button className="rounded-md p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
