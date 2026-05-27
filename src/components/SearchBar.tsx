import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarIcon, MapPin, Search, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    navigate({ to: "/search" });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-3 shadow-lg shadow-primary/5",
        compact ? "" : "md:p-4",
      )}
    >
      <div className="grid gap-2 md:grid-cols-[1.4fr_1.4fr_1fr_auto] md:gap-2">
        <Field icon={<MapPin className="h-4 w-4" />} label="จุดหมาย">
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="เมือง โรงแรม หรือพื้นที่"
            className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </Field>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-start gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-secondary/50"
            >
              <CalendarIcon className="mt-1 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">เช็คอิน — เช็คเอาต์</div>
                <div className="text-sm font-medium text-foreground">
                  {range?.from
                    ? `${format(range.from, "d MMM")}${range.to ? ` — ${format(range.to, "d MMM")}` : ""}`
                    : "เลือกวันที่"}
                </div>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Field icon={<Users className="h-4 w-4" />} label="ผู้เข้าพัก">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-sm hover:bg-secondary"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests(guests + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-sm hover:bg-secondary"
            >
              +
            </button>
          </div>
        </Field>

        <Button onClick={handleSearch} size="lg" className="h-auto self-stretch px-6">
          <Search className="mr-2 h-4 w-4" />
          ค้นหา
        </Button>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-secondary/50">
      <div className="mt-1 text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}
