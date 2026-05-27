import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BedDouble,
  CalendarRange,
  ClipboardList,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Sànd" }] }),
  component: AdminLayout,
});

const navItems: Array<{
  to: "/admin" | "/admin/rooms" | "/admin/calendar" | "/admin/bookings" | "/admin/pricing";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/admin", label: "แดชบอร์ด", icon: LayoutDashboard, exact: true },
  { to: "/admin/rooms", label: "ห้องพัก", icon: BedDouble },
  { to: "/admin/calendar", label: "ปฏิทินสถานะ", icon: CalendarRange },
  { to: "/admin/bookings", label: "การจอง", icon: ClipboardList },
  { to: "/admin/pricing", label: "ราคาอัจฉริยะ", icon: Tag },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/" className="flex items-center gap-2 font-serif text-xl">
            Sànd<span className="text-primary">.</span>
            <span className="ml-1 text-xs uppercase tracking-wider text-muted-foreground">
              admin
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับสู่ฝั่งลูกค้า
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        {/* Mobile nav */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-border bg-background px-4 py-3 lg:hidden">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs",
                  active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
