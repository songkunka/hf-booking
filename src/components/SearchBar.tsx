import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarIcon, Search, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    navigate({ to: "/rooms" });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-3 shadow-lg shadow-primary/5",
        compact ? "" : "md:p-4",
      )}
    >
      <div className="grid gap-2 md:grid-cols-[1.6fr_1fr_auto] md:gap-2">
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

        <div className="flex items-start gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-secondary/50">
          <div className="mt-1 text-muted-foreground">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">ผู้เข้าพัก</div>
            <div className="mt-0.5 flex items-center gap-2">
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
          </div>
        </div>

        <Button onClick={handleSearch} size="lg" className="h-auto self-stretch px-6">
          <Search className="mr-2 h-4 w-4" />
          ดูห้องว่าง
        </Button>
      </div>
    </div>
  );
}
