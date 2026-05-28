import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { HOTEL } from "@/data/rooms";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-serif text-2xl">
              {HOTEL.name.split(" ")[0]}
              <span className="text-primary">.</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{HOTEL.tagline}</p>
            <p className="mt-4 inline-flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {HOTEL.address}
            </p>
          </div>

          <div>
            <div className="text-sm font-medium text-foreground">ติดต่อจอง</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${HOTEL.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                  {HOTEL.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${HOTEL.email}`} className="hover:text-foreground">
                  {HOTEL.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-medium text-foreground">เวลาให้บริการ</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" /> เช็คอิน {HOTEL.checkInTime} น.
              </li>
              <li className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" /> เช็คเอาต์ {HOTEL.checkOutTime} น.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {HOTEL.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
