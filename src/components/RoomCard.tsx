import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Room } from "@/data/rooms";

export function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      to="/rooms/$id"
      params={{ id: room.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={room.image}
          alt={room.name}
          loading="lazy"
          width={1280}
          height={960}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
          {room.type}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl leading-snug text-foreground">{room.name}</h3>
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="font-medium">{room.rating}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{room.location}</div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <div className="font-serif text-2xl text-foreground">
              ฿{room.price.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">/ คืน · รวมภาษี</div>
          </div>
          <div className="text-xs text-muted-foreground">
            {room.reviewsCount} รีวิว
          </div>
        </div>
      </div>
    </Link>
  );
}
