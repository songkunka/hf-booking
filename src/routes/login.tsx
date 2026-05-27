import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "เข้าสู่ระบบ · Sànd" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
        <h1 className="font-serif text-5xl">
          {mode === "login" ? "ยินดีต้อนรับกลับ" : "สร้างบัญชี"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {mode === "login" ? "เข้าสู่ระบบเพื่อจัดการการจองของคุณ" : "เริ่มต้นจองที่พักบูทีคได้เลย"}
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.info("Auth จะเปิดในรอบถัดไปครับ");
          }}
        >
          {mode === "signup" && (
            <div>
              <Label>ชื่อ-นามสกุล</Label>
              <Input className="mt-1.5" required />
            </div>
          )}
          <div>
            <Label>อีเมล</Label>
            <Input type="email" className="mt-1.5" required />
          </div>
          <div>
            <Label>รหัสผ่าน</Label>
            <Input type="password" className="mt-1.5" required />
          </div>
          <Button type="submit" size="lg" className="w-full">
            {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          หรือ
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2">
          <SocialButton label="ดำเนินการต่อด้วย Google" />
          <SocialButton label="ดำเนินการต่อด้วย Facebook" />
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {mode === "login" ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {mode === "login" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </button>
        </div>

        <Link
          to="/"
          className="mt-6 text-center text-xs text-muted-foreground hover:text-foreground"
        >
          ← กลับสู่หน้าแรก
        </Link>
      </main>
    </div>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      onClick={() => toast.info("Social login จะเปิดในรอบถัดไป")}
    >
      {label}
    </Button>
  );
}
