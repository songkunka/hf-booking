import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Eye, EyeOff, RefreshCw, Send, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MOCK_BOOKINGS, getRoom, ROOMS } from "@/data/rooms";

export const Route = createFileRoute("/admin/api")({
  component: AdminApi,
});

/* ── helpers ── */
function generateApiKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "hf_live_";
  for (let i = 0; i < 40; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("คัดลอกแล้ว");
}

/* ── types ── */
type EndpointMethod = "GET" | "POST" | "PUT" | "PATCH";

interface Endpoint {
  method: EndpointMethod;
  path: string;
  title: string;
  description: string;
  requestBody?: string;
  responseBody: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
}

/* ── mock data builders ── */
const sampleBooking = MOCK_BOOKINGS[0];
const sampleRoom = getRoom(sampleBooking.roomId)!;

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/v1/bookings",
    title: "ดึงรายการจองทั้งหมด",
    description: "ดึงรายการจองทั้งหมด สามารถกรองด้วย status, วันที่เช็คอิน หรือเช็คเอาต์",
    params: [
      { name: "status", type: "string", required: false, description: "กรองสถานะ: Pending | Confirmed | Checked-in | Checked-out | Cancelled" },
      { name: "check_in_from", type: "date", required: false, description: "กรองวันเช็คอินตั้งแต่ (YYYY-MM-DD)" },
      { name: "check_in_to", type: "date", required: false, description: "กรองวันเช็คอินถึง (YYYY-MM-DD)" },
      { name: "page", type: "number", required: false, description: "หน้าที่ต้องการ (default: 1)" },
      { name: "limit", type: "number", required: false, description: "จำนวนต่อหน้า (default: 20, max: 100)" },
    ],
    responseBody: JSON.stringify(
      {
        success: true,
        data: MOCK_BOOKINGS.slice(0, 2).map((b) => ({
          id: b.id,
          room: { id: b.roomId, name: getRoom(b.roomId)?.name },
          guest: b.guest,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          nights: b.nights,
          total: b.total,
          currency: "THB",
          status: b.status,
          createdAt: "2026-05-28T06:00:00Z",
        })),
        pagination: { page: 1, limit: 20, total: MOCK_BOOKINGS.length },
      },
      null,
      2,
    ),
  },
  {
    method: "GET",
    path: "/api/v1/bookings/:id",
    title: "ดึงรายละเอียดการจอง",
    description: "ดึงข้อมูลรายละเอียดการจองตาม Booking ID",
    params: [{ name: "id", type: "string", required: true, description: "Booking ID เช่น BK-10293" }],
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          id: sampleBooking.id,
          room: { id: sampleRoom.id, name: sampleRoom.name, type: sampleRoom.type, price: sampleRoom.price },
          guest: { name: sampleBooking.guest, email: "somchai@email.com", phone: "+66812345678" },
          checkIn: sampleBooking.checkIn,
          checkOut: sampleBooking.checkOut,
          nights: sampleBooking.nights,
          total: sampleBooking.total,
          taxes: Math.round(sampleBooking.total * 0.07),
          currency: "THB",
          status: sampleBooking.status,
          paymentMethod: "credit_card",
          specialRequests: "ขอเตียงเสริม",
          createdAt: "2026-05-28T06:00:00Z",
          updatedAt: "2026-05-28T06:10:00Z",
        },
      },
      null,
      2,
    ),
  },
  {
    method: "POST",
    path: "/api/v1/bookings",
    title: "สร้างการจองใหม่",
    description: "สร้างการจองใหม่เมื่อมีลูกค้าจองห้องพัก ระบบจะตรวจสอบห้องว่างและล็อกห้องให้อัตโนมัติ",
    params: [
      { name: "roomId", type: "string", required: true, description: "รหัสห้องพัก เช่น terracotta-suite" },
      { name: "guest.name", type: "string", required: true, description: "ชื่อผู้เข้าพัก" },
      { name: "guest.email", type: "string", required: true, description: "อีเมลผู้เข้าพัก" },
      { name: "guest.phone", type: "string", required: true, description: "เบอร์โทรผู้เข้าพัก" },
      { name: "checkIn", type: "date", required: true, description: "วันเช็คอิน (YYYY-MM-DD)" },
      { name: "checkOut", type: "date", required: true, description: "วันเช็คเอาต์ (YYYY-MM-DD)" },
      { name: "guests", type: "number", required: true, description: "จำนวนผู้เข้าพัก" },
      { name: "paymentMethod", type: "string", required: false, description: "วิธีชำระเงิน: credit_card | promptpay | pay_at_hotel" },
      { name: "specialRequests", type: "string", required: false, description: "คำขอพิเศษ" },
    ],
    requestBody: JSON.stringify(
      {
        roomId: "terracotta-suite",
        guest: { name: "Somchai P.", email: "somchai@email.com", phone: "+66812345678" },
        checkIn: "2026-07-01",
        checkOut: "2026-07-04",
        guests: 2,
        paymentMethod: "credit_card",
        specialRequests: "ขอเตียงเสริม 1 เตียง",
      },
      null,
      2,
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          id: "BK-20001",
          room: { id: "terracotta-suite", name: "Terracotta Garden Suite" },
          guest: { name: "Somchai P.", email: "somchai@email.com", phone: "+66812345678" },
          checkIn: "2026-07-01",
          checkOut: "2026-07-04",
          nights: 3,
          total: 9600,
          taxes: 672,
          currency: "THB",
          status: "Pending",
          paymentMethod: "credit_card",
          specialRequests: "ขอเตียงเสริม 1 เตียง",
          createdAt: "2026-05-28T13:00:00Z",
        },
        message: "การจองสำเร็จ รอยืนยันการชำระเงิน",
      },
      null,
      2,
    ),
  },
  {
    method: "PATCH",
    path: "/api/v1/bookings/:id/status",
    title: "อัปเดตสถานะการจอง",
    description: "อัปเดตสถานะการจอง เช่น ยืนยัน, เช็คอิน, เช็คเอาต์ หรือยกเลิก",
    params: [
      { name: "id", type: "string", required: true, description: "Booking ID" },
      { name: "status", type: "string", required: true, description: "สถานะใหม่: Confirmed | Checked-in | Checked-out | Cancelled" },
      { name: "reason", type: "string", required: false, description: "เหตุผล (จำเป็นเมื่อยกเลิก)" },
    ],
    requestBody: JSON.stringify(
      { status: "Confirmed" },
      null,
      2,
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          id: "BK-10294",
          status: "Confirmed",
          previousStatus: "Pending",
          updatedAt: "2026-05-28T13:05:00Z",
        },
        message: "อัปเดตสถานะเป็น Confirmed เรียบร้อย",
      },
      null,
      2,
    ),
  },
  {
    method: "GET",
    path: "/api/v1/rooms/availability",
    title: "ตรวจสอบห้องว่าง",
    description: "ตรวจสอบห้องว่างตามช่วงวันที่ระบุ",
    params: [
      { name: "check_in", type: "date", required: true, description: "วันเช็คอิน (YYYY-MM-DD)" },
      { name: "check_out", type: "date", required: true, description: "วันเช็คเอาต์ (YYYY-MM-DD)" },
      { name: "guests", type: "number", required: false, description: "จำนวนผู้เข้าพัก" },
    ],
    responseBody: JSON.stringify(
      {
        success: true,
        data: ROOMS.map((r) => ({
          id: r.id,
          name: r.name,
          type: r.type,
          price: r.price,
          capacity: r.capacity,
          available: Math.random() > 0.3,
        })),
        query: { checkIn: "2026-07-01", checkOut: "2026-07-04", guests: 2 },
      },
      null,
      2,
    ),
  },
  {
    method: "POST",
    path: "/api/v1/webhooks/booking",
    title: "Webhook — แจ้งเตือนการจอง",
    description:
      "ตั้งค่า Webhook URL เพื่อรับ event แจ้งเตือนอัตโนมัติ เมื่อมีการจองใหม่, ยืนยัน, เช็คอิน, เช็คเอาต์ หรือยกเลิก ระบบจะส่ง POST request ไปยัง URL ที่ลงทะเบียนไว้",
    requestBody: JSON.stringify(
      {
        url: "https://your-server.com/webhook/hotelflow",
        events: ["booking.created", "booking.confirmed", "booking.checked_in", "booking.checked_out", "booking.cancelled"],
        secret: "whsec_your_signing_secret",
      },
      null,
      2,
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          id: "wh_001",
          url: "https://your-server.com/webhook/hotelflow",
          events: ["booking.created", "booking.confirmed", "booking.checked_in", "booking.checked_out", "booking.cancelled"],
          active: true,
          createdAt: "2026-05-28T13:00:00Z",
        },
        message: "Webhook ลงทะเบียนเรียบร้อย",
      },
      null,
      2,
    ),
  },
];

/* ── page ── */
const methodColor: Record<EndpointMethod, string> = {
  GET: "bg-emerald-500/15 text-emerald-600",
  POST: "bg-blue-500/15 text-blue-600",
  PUT: "bg-amber-500/15 text-amber-600",
  PATCH: "bg-violet-500/15 text-violet-600",
};

function AdminApi() {
  const [apiKey] = useState(() => generateApiKey());
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const handleCopyKey = () => {
    copyToClipboard(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">API</p>
        <h1 className="font-serif text-4xl">API สำหรับระบบจอง</h1>
        <p className="mt-2 text-muted-foreground">
          ใช้ API เหล่านี้เพื่อส่งและรับข้อมูลการจองห้องพักแบบเรียลไทม์ รองรับการสร้างจอง ตรวจสอบสถานะ
          และรับ Webhook แจ้งเตือน
        </p>
      </div>

      {/* API Key section */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl">API Key</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ใช้ Header <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">Authorization: Bearer &lt;API_KEY&gt;</code> ในทุก request
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.info("สร้าง API Key ใหม่เรียบร้อย (demo)")}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> สร้างใหม่
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              readOnly
              value={showKey ? apiKey : apiKey.replace(/./g, "•")}
              className="pr-20 font-mono text-sm"
            />
            <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <button
                onClick={() => setShowKey(!showKey)}
                className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                title={showKey ? "ซ่อน" : "แสดง"}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={handleCopyKey}
                className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                title="คัดลอก"
              >
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Base URL */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Base URL</h2>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-secondary/60 px-4 py-3 font-mono text-sm">
          <span className="text-muted-foreground">https://</span>
          <span className="text-foreground">api.hotelflow.com</span>
          <button
            onClick={() => copyToClipboard("https://api.hotelflow.com")}
            className="ml-auto rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Response ทุก endpoint เป็น JSON · Rate limit: 100 req/min · ใช้ HTTPS เท่านั้น
        </p>
      </div>

      {/* Endpoints */}
      <div className="mt-8 space-y-3">
        <h2 className="font-serif text-2xl">Endpoints</h2>

        {ENDPOINTS.map((ep, idx) => {
          const open = expandedIdx === idx;
          return (
            <div
              key={`${ep.method}-${ep.path}`}
              className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
            >
              {/* header row */}
              <button
                onClick={() => setExpandedIdx(open ? null : idx)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
              >
                <Badge className={`${methodColor[ep.method]} shrink-0 font-mono text-xs font-semibold`}>
                  {ep.method}
                </Badge>
                <code className="text-sm font-medium text-foreground">{ep.path}</code>
                <span className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">{ep.title}</span>
                  {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>
              </button>

              {open && (
                <div className="border-t border-border px-5 pb-5 pt-4 space-y-5">
                  <p className="text-sm text-muted-foreground">{ep.description}</p>

                  {/* Params table */}
                  {ep.params && ep.params.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Parameters</h4>
                      <div className="mt-2 overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                          <thead className="bg-secondary/50 text-left text-muted-foreground">
                            <tr>
                              <th className="px-4 py-2 font-medium">ชื่อ</th>
                              <th className="px-4 py-2 font-medium">ประเภท</th>
                              <th className="px-4 py-2 font-medium">จำเป็น</th>
                              <th className="px-4 py-2 font-medium">คำอธิบาย</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ep.params.map((p) => (
                              <tr key={p.name} className="border-t border-border">
                                <td className="px-4 py-2 font-mono text-xs text-primary">{p.name}</td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">{p.type}</td>
                                <td className="px-4 py-2">
                                  {p.required ? (
                                    <Badge className="bg-primary/15 text-primary text-[10px]">Required</Badge>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Optional</span>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">{p.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Request Body */}
                  {ep.requestBody && (
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">Request Body</h4>
                        <button
                          onClick={() => copyToClipboard(ep.requestBody!)}
                          className="rounded p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <pre className="mt-2 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-emerald-400">
                        <code>{ep.requestBody}</code>
                      </pre>
                    </div>
                  )}

                  {/* Response */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground">
                        Response <Badge className="ml-1.5 bg-emerald-500/15 text-emerald-600 text-[10px]">200 OK</Badge>
                      </h4>
                      <button
                        onClick={() => copyToClipboard(ep.responseBody)}
                        className="rounded p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <pre className="mt-2 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-sky-400">
                      <code>{ep.responseBody}</code>
                    </pre>
                  </div>

                  {/* Try it */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success(`${ep.method} ${ep.path} → 200 OK (demo)`)}
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" /> ทดสอบ API
                    </Button>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `curl -X ${ep.method} https://api.hotelflow.com${ep.path.replace(":id", sampleBooking.id)} \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  -H "Content-Type: application/json"${ep.requestBody ? ` \\\n  -d '${ep.requestBody.replace(/\n/g, "")}'` : ""}`,
                        )
                      }
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      คัดลอก cURL
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Error codes */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Error Codes</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">HTTP Code</th>
                <th className="px-4 py-2 font-medium">ความหมาย</th>
                <th className="px-4 py-2 font-medium">เมื่อใด</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: "400", label: "Bad Request", desc: "ข้อมูลไม่ถูกต้อง เช่น วันที่ผิดรูปแบบ" },
                { code: "401", label: "Unauthorized", desc: "API Key ไม่ถูกต้องหรือหมดอายุ" },
                { code: "404", label: "Not Found", desc: "ไม่พบ Booking ID หรือ Room ID" },
                { code: "409", label: "Conflict", desc: "ห้องถูกจองไปแล้วในช่วงเวลาเดียวกัน" },
                { code: "429", label: "Too Many Requests", desc: "เกิน Rate limit (100 req/min)" },
                { code: "500", label: "Server Error", desc: "เกิดข้อผิดพลาดภายในระบบ" },
              ].map((e) => (
                <tr key={e.code} className="border-t border-border">
                  <td className="px-4 py-2 font-mono text-xs font-semibold text-destructive">{e.code}</td>
                  <td className="px-4 py-2 font-medium">{e.label}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook events */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 mb-8">
        <h2 className="font-serif text-xl">Webhook Events</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          เมื่อเกิดเหตุการณ์ ระบบจะส่ง POST request ไปยัง Webhook URL ที่ลงทะเบียนไว้ พร้อม payload ดังนี้
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-amber-400">
          <code>
            {JSON.stringify(
              {
                event: "booking.created",
                timestamp: "2026-05-28T13:00:00Z",
                data: {
                  id: "BK-20001",
                  roomId: "terracotta-suite",
                  guest: "Somchai P.",
                  checkIn: "2026-07-01",
                  checkOut: "2026-07-04",
                  total: 9600,
                  status: "Pending",
                },
              },
              null,
              2,
            )}
          </code>
        </pre>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            { event: "booking.created", desc: "เมื่อมีการจองใหม่" },
            { event: "booking.confirmed", desc: "เมื่อยืนยันการจอง" },
            { event: "booking.checked_in", desc: "เมื่อแขกเช็คอิน" },
            { event: "booking.checked_out", desc: "เมื่อแขกเช็คเอาต์" },
            { event: "booking.cancelled", desc: "เมื่อยกเลิกการจอง" },
            { event: "booking.updated", desc: "เมื่อข้อมูลการจองถูกแก้ไข" },
          ].map((e) => (
            <div key={e.event} className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">
              <code className="text-xs font-mono text-primary">{e.event}</code>
              <span className="text-muted-foreground">— {e.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
