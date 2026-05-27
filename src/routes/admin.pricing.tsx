import { createFileRoute } from "@tanstack/react-router";
import { ROOMS } from "@/data/rooms";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/pricing")({
  component: AdminPricing,
});

function AdminPricing() {
  return (
    <div>
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Pricing</p>
        <h1 className="font-serif text-4xl">ราคาอัจฉริยะ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ตั้งราคาแยกตามวันธรรมดา / วันหยุด / ช่วงฤดูกาล
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {ROOMS.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <img src={r.image} alt="" className="h-12 w-16 rounded-md object-cover" />
              <div className="flex-1">
                <div className="font-serif text-xl">{r.name}</div>
                <div className="text-xs text-muted-foreground">ราคาฐาน ฿{r.price.toLocaleString()} / คืน</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Dynamic Pricing
                <Switch defaultChecked />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <PriceField label="วันธรรมดา (จ-พฤ)" defaultValue={r.price} />
              <PriceField label="วันหยุดสุดสัปดาห์" defaultValue={Math.round(r.price * 1.2)} />
              <PriceField label="ฤดูท่องเที่ยว (พ.ย.-ก.พ.)" defaultValue={Math.round(r.price * 1.5)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceField({ label, defaultValue }: { label: string; defaultValue: number }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1 flex items-center rounded-md border border-border bg-background pl-3">
        <span className="text-sm text-muted-foreground">฿</span>
        <Input defaultValue={defaultValue} className="border-0 shadow-none focus-visible:ring-0" />
      </div>
    </div>
  );
}
