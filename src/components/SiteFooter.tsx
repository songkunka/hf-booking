export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="font-serif text-2xl">Sànd<span className="text-primary">.</span></div>
            <p className="mt-3 text-sm text-muted-foreground">
              จองที่พักบูทีคทั่วไทย แบบเรียลไทม์ ปลอดภัย ยกเลิกได้
            </p>
          </div>
          <FooterCol title="สำรวจ" links={["ที่พักทั้งหมด", "Chiang Mai", "Phuket", "Bangkok"]} />
          <FooterCol title="ช่วยเหลือ" links={["ติดต่อเรา", "ศูนย์ช่วยเหลือ", "นโยบายการยกเลิก", "เงื่อนไขการใช้งาน"]} />
          <FooterCol title="สำหรับเจ้าของที่พัก" links={["ลงประกาศที่พัก", "Admin Panel", "API & คู่มือ"]} />
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sànd Boutique Stays. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l} className="cursor-pointer hover:text-foreground">{l}</li>
        ))}
      </ul>
    </div>
  );
}
