import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Eye, EyeOff, Send, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ROOMS } from "@/data/rooms";

export const Route = createFileRoute("/admin/api")({
  component: AdminApi,
});

/* ── env keys ── */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://iqktqhgnnivhygrytous.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3RxaGdubml2aHlncnl0b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NDg2MTEsImV4cCI6MjA5NTUyNDYxMX0.epILdTsggdB-rOZI5pPTvW0ofj7YAsZ0-WeIpWecuuA";

/* ── helpers ── */
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("คัดลอกแล้ว");
}

/* ── types ── */
type EndpointMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Endpoint {
  method: EndpointMethod;
  path: string;
  title: string;
  description: string;
  requestBody?: string;
  responseBody: string;
  curlQuery?: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/rest/v1/bookings?select=*",
    title: "ดึงรายการจองทั้งหมด",
    description: "ดึงรายการจองทั้งหมดจากฐานข้อมูล สามารถกรองด้วย Query Parameters ตามมาตรฐาน PostgREST ของ Supabase",
    params: [
      { name: "status", type: "string", required: false, description: "กรองสถานะ: เพิ่ม &status=eq.confirmed ท้าย URL" },
      { name: "limit", type: "number", required: false, description: "จำกัดจำนวน: เพิ่ม &limit=10" },
      { name: "order", type: "string", required: false, description: "เรียงลำดับ: เพิ่ม &order=created_at.desc" },
    ],
    curlQuery: "?select=*&order=created_at.desc&limit=5",
    responseBody: JSON.stringify(
      [
        {
          "id": "e81f...",
          "booking_ref": "BK-10293",
          "room_id": "terracotta-suite",
          "guest_first_name": "Somchai",
          "guest_last_name": "P.",
          "guest_email": "somchai@email.com",
          "guest_phone": "0812345678",
          "check_in_date": "2026-07-01",
          "check_out_date": "2026-07-04",
          "nights": 3,
          "total_price": 9600,
          "status": "confirmed",
          "created_at": "2026-05-28T06:00:00Z"
        }
      ],
      null,
      2,
    ),
  },
  {
    method: "GET",
    path: "/rest/v1/bookings?booking_ref=eq.{id}",
    title: "ดึงรายละเอียดการจองตามรหัส",
    description: "ค้นหาข้อมูลการจองเฉพาะรายการ โดยระบุ booking_ref (เช่น BK-10293)",
    params: [{ name: "booking_ref", type: "string", required: true, description: "รหัสจอง เช่น eq.BK-10293" }],
    curlQuery: "?booking_ref=eq.BK-10293&select=*",
    responseBody: JSON.stringify(
      [
        {
          "id": "e81f...",
          "booking_ref": "BK-10293",
          "room_id": "terracotta-suite",
          "status": "confirmed"
        }
      ],
      null,
      2,
    ),
  },
  {
    method: "POST",
    path: "/rest/v1/bookings",
    title: "สร้างการจองใหม่",
    description: "สร้างการจองใหม่ลงตาราง bookings ต้องส่ง Header `Prefer: return=representation` หากต้องการให้คืนค่าข้อมูลที่เพิ่งสร้างกลับมา",
    params: [
      { name: "booking_ref", type: "string", required: true, description: "รหัสการจอง เช่น BK-20001" },
      { name: "room_id", type: "string", required: true, description: "รหัสห้องพัก (เช่น terracotta-suite)" },
      { name: "guest_first_name", type: "string", required: true, description: "ชื่อผู้เข้าพัก" },
      { name: "check_in_date", type: "date", required: true, description: "วันเช็คอิน (YYYY-MM-DD)" },
      { name: "check_out_date", type: "date", required: true, description: "วันเช็คเอาต์ (YYYY-MM-DD)" },
    ],
    requestBody: JSON.stringify(
      {
        booking_ref: "BK-20001",
        room_id: "terracotta-suite",
        guest_first_name: "Somchai",
        guest_last_name: "P.",
        guest_email: "somchai@email.com",
        guest_phone: "0812345678",
        check_in_date: "2026-07-01",
        check_out_date: "2026-07-04",
        nights: 3,
        total_price: 9600,
        status: "pending"
      },
      null,
      2,
    ),
    responseBody: JSON.stringify(
      [
        {
          "id": "new-uuid",
          "booking_ref": "BK-20001",
          "status": "pending"
        }
      ],
      null,
      2,
    ),
  },
  {
    method: "PATCH",
    path: "/rest/v1/bookings?booking_ref=eq.{id}",
    title: "อัปเดตสถานะการจอง",
    description: "อัปเดตข้อมูลการจองเฉพาะฟิลด์ที่ส่งไป เช่น เปลี่ยนสถานะเป็น confirmed, checked-in",
    params: [
      { name: "booking_ref", type: "string", required: true, description: "รหัสที่ต้องการอัปเดต เช่น eq.BK-20001" },
    ],
    curlQuery: "?booking_ref=eq.BK-20001",
    requestBody: JSON.stringify(
      { status: "confirmed" },
      null,
      2,
    ),
    responseBody: "204 No Content (หากไม่ใส่ Prefer header)\nหรือคืนค่าข้อมูลหากใส่ Prefer: return=representation",
  },
];

/* ── page ── */
const methodColor: Record<EndpointMethod, string> = {
  GET: "bg-emerald-500/15 text-emerald-600",
  POST: "bg-blue-500/15 text-blue-600",
  PUT: "bg-amber-500/15 text-amber-600",
  PATCH: "bg-violet-500/15 text-violet-600",
  DELETE: "bg-red-500/15 text-red-600",
};

function AdminApi() {
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const handleCopyKey = () => {
    copyToClipboard(supabaseAnonKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-4 text-xs font-medium text-primary">
          <Check className="h-3.5 w-3.5" /> ขับเคลื่อนโดย Supabase REST API
        </div>
        <h1 className="font-serif text-4xl">API สำหรับระบบจอง</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          เนื่องจากเราใช้งานฐานข้อมูลผ่าน Supabase ระบบจึงสร้าง REST API ให้อัตโนมัติตามมาตรฐาน <strong>PostgREST</strong> 
          <br/>คุณสามารถนำ Base URL และ API Key ไปให้ Partner หรือยิงผ่านแอปพลิเคชันอื่นเพื่อเชื่อมต่อกับตาราง <code>bookings</code> ได้ทันที
        </p>
      </div>

      {/* API Key section */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl flex items-center gap-2">
              Authentication (API Key)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ต้องส่ง Header 2 ตัวในทุก Request เสมอ:
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 font-mono text-sm">
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2 border border-border/50">
            <span className="font-semibold w-24">apikey:</span> 
            <span className="text-muted-foreground flex-1 break-all">
              {showKey ? supabaseAnonKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh..."}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2 border border-border/50">
            <span className="font-semibold w-24">Authorization:</span> 
            <span className="text-muted-foreground flex-1 break-all">
              Bearer {showKey ? supabaseAnonKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh..."}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
           <Button variant="outline" size="sm" onClick={() => setShowKey(!showKey)}>
              {showKey ? <EyeOff className="mr-1.5 h-4 w-4" /> : <Eye className="mr-1.5 h-4 w-4" />}
              {showKey ? "ซ่อนคีย์" : "แสดงคีย์จริงของคุณ"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCopyKey}>
              {copiedKey ? <Check className="mr-1.5 h-4 w-4 text-primary" /> : <Copy className="mr-1.5 h-4 w-4" />}
              คัดลอก ANON KEY
            </Button>
        </div>
      </div>

      {/* Base URL */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Base URL</h2>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 font-mono text-sm">
          <span className="text-foreground font-semibold break-all">{supabaseUrl}/rest/v1</span>
          <button
            onClick={() => copyToClipboard(`${supabaseUrl}/rest/v1`)}
            className="ml-auto rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition"
            title="คัดลอก Base URL"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          หากต้องการเรียกตารางไหน ให้เติมชื่อตารางต่อท้าย เช่น <code>/rest/v1/bookings</code> หรือ <code>/rest/v1/rooms</code>
        </p>
      </div>

      {/* Endpoints */}
      <div className="mt-8 space-y-3">
        <h2 className="font-serif text-2xl">Endpoints สำหรับการจอง</h2>

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
                      <h4 className="text-sm font-medium text-foreground">Parameters / Query</h4>
                      <div className="mt-2 overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                          <thead className="bg-secondary/50 text-left text-muted-foreground">
                            <tr>
                              <th className="px-4 py-2 font-medium">ฟิลด์</th>
                              <th className="px-4 py-2 font-medium">ประเภท</th>
                              <th className="px-4 py-2 font-medium">บังคับ</th>
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
                        <h4 className="text-sm font-medium text-foreground">Request Body (JSON)</h4>
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
                        Response Example
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
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `curl -X ${ep.method} '${supabaseUrl}/rest/v1/bookings${ep.curlQuery || ""}' \\\n-H "apikey: ${supabaseAnonKey}" \\\n-H "Authorization: Bearer ${supabaseAnonKey}" \\\n-H "Content-Type: application/json"${ep.method === "POST" || ep.method === "PATCH" ? ` \\\n-H "Prefer: return=representation"` : ""}${ep.requestBody ? ` \\\n-d '${ep.requestBody.replace(/\n/g, "")}'` : ""}`,
                        )
                      }
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      <Copy className="mr-1.5 h-3.5 w-3.5" /> คัดลอกคำสั่ง cURL ของจริงไปทดสอบ
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Webhook events */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 mb-12">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Send className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl">Database Webhooks (การแจ้งเตือนอัตโนมัติ)</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              หากต้องการให้ระบบส่งแจ้งเตือน (HTTP POST) ไปยัง Server หรือ Line Notify ของคุณ ทันทีที่มีลูกค้ายืนยันการจอง 
              คุณไม่ต้องพึ่งพา Backend ของเว็บเราเลย!
            </p>
            <p className="mt-2 text-sm text-foreground font-medium">
              คุณสามารถไปเปิดใช้งานได้ที่ <a href="https://supabase.com/dashboard/project/_/database/hooks" target="_blank" rel="noreferrer" className="inline-flex items-center text-primary hover:underline">Supabase Dashboard <ExternalLink className="ml-1 h-3 w-3" /></a>
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>ไปที่เมนู <strong>Database</strong> &gt; <strong>Webhooks</strong></li>
              <li>สร้าง Webhook ใหม่ เลือกตาราง <code>bookings</code></li>
              <li>เลือก Events: <strong>Insert</strong> (จองใหม่) หรือ <strong>Update</strong> (เปลี่ยนสถานะ)</li>
              <li>ใส่ URL ปลายทางที่คุณต้องการให้ Supabase ยิงข้อมูลไปให้</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
