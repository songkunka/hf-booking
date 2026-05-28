import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import room4 from "@/assets/room-4.jpg";
import heroImg from "@/assets/hero.jpg";

export const HOTEL = {
  name: "HotelFlow",
  tagline: "บูทีครีสอร์ตริมแม่น้ำปิง · เชียงใหม่",
  address: "88 ถนนเจริญราษฎร์ ต.วัดเกต อ.เมือง จ.เชียงใหม่ 50000",
  phone: "+66 53 123 456",
  email: "stay@hotelflow.com",
  checkInTime: "15:00",
  checkOutTime: "12:00",
  totalRoomTypes: 4,
  rating: 4.9,
  reviewsCount: 839,
  heroImage: heroImg,
  highlights: [
    "ติดริมแม่น้ำปิง วิวพระอาทิตย์ขึ้น",
    "สระว่ายน้ำ Infinity ชั้นดาดฟ้า",
    "ห้องอาหาร Farm-to-Table",
    "สปา & โยคะพาวิลเลียน",
  ],
};

export type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  rating: number;
  reviewsCount: number;
  capacity: number;
  beds: string;
  size: number;
  image: string;
  gallery: string[];
  amenities: string[];
  description: string;
  cancellation: string;
};

export const ROOMS: Room[] = [
  {
    id: "terracotta-suite",
    name: "Terracotta Garden Suite",
    type: "Suite",
    price: 3200,
    rating: 4.9,
    reviewsCount: 184,
    capacity: 2,
    beds: "1 King",
    size: 42,
    image: room1,
    gallery: [room1, room3, room2],
    amenities: ["wifi", "breakfast", "pool", "ac", "garden"],
    description:
      "ห้องสวีทโทนเทอร์ราคอตต้าอบอุ่น มองเห็นสวนส่วนตัว ตกแต่งสไตล์มินิมอลตะวันออก พร้อมเตียงคิงไซส์และอ่างแช่ในห้องน้ำ",
    cancellation: "ยกเลิกฟรีก่อนเช็คอิน 48 ชั่วโมง",
  },
  {
    id: "riverside-villa",
    name: "Riverside Pool Villa",
    type: "Pool Villa",
    price: 6800,
    rating: 4.95,
    reviewsCount: 312,
    capacity: 4,
    beds: "2 Queen",
    size: 78,
    image: room2,
    gallery: [room2, room1, room4],
    amenities: ["wifi", "breakfast", "pool", "ac", "garden", "parking"],
    description:
      "วิลล่าริมแม่น้ำพร้อมสระว่ายน้ำส่วนตัว เห็นวิวสายน้ำเต็มตา เฟอร์นิเจอร์หวายและระเบียงชมพระอาทิตย์",
    cancellation: "ยกเลิกฟรีก่อนเช็คอิน 7 วัน",
  },
  {
    id: "garden-cottage",
    name: "Hidden Garden Cottage",
    type: "Cottage",
    price: 1850,
    rating: 4.8,
    reviewsCount: 96,
    capacity: 2,
    beds: "1 Queen",
    size: 28,
    image: room3,
    gallery: [room3, room1, room4],
    amenities: ["wifi", "breakfast", "garden", "ac"],
    description:
      "กระท่อมไม้หลังเล็กท่ามกลางสวน บรรยากาศเงียบสงบ เหมาะกับคู่รักที่อยากหลบความวุ่นวาย",
    cancellation: "ยกเลิกฟรีก่อนเช็คอิน 24 ชั่วโมง",
  },
  {
    id: "skyline-loft",
    name: "Rooftop Skyline Loft",
    type: "Loft",
    price: 4500,
    rating: 4.85,
    reviewsCount: 247,
    capacity: 3,
    beds: "1 King + Sofa",
    size: 55,
    image: room4,
    gallery: [room4, room2, room1],
    amenities: ["wifi", "pool", "ac", "gym", "parking"],
    description:
      "ลอฟต์ชั้นดาดฟ้า วิวเมืองเชียงใหม่ 270 องศา ตกแต่งสไตล์โมเดิร์น เข้าถึงสระว่ายน้ำดาดฟ้าโดยตรง",
    cancellation: "ยกเลิกฟรีก่อนเช็คอิน 48 ชั่วโมง",
  },
];

export const AMENITY_LABELS: Record<string, string> = {
  wifi: "Wi-Fi ฟรี",
  breakfast: "อาหารเช้า",
  pool: "สระว่ายน้ำ",
  ac: "เครื่องปรับอากาศ",
  garden: "สวน",
  parking: "ที่จอดรถ",
  gym: "ฟิตเนส",
};

export function getRoom(id: string) {
  return ROOMS.find((r) => r.id === id);
}

export const MOCK_BOOKINGS = [
  {
    id: "BK-10293",
    roomId: "terracotta-suite",
    guest: "Somchai P.",
    checkIn: "2026-06-02",
    checkOut: "2026-06-05",
    nights: 3,
    total: 9600,
    status: "Confirmed" as const,
  },
  {
    id: "BK-10294",
    roomId: "riverside-villa",
    guest: "Nicha K.",
    checkIn: "2026-06-04",
    checkOut: "2026-06-09",
    nights: 5,
    total: 34000,
    status: "Pending" as const,
  },
  {
    id: "BK-10295",
    roomId: "skyline-loft",
    guest: "Aran S.",
    checkIn: "2026-05-28",
    checkOut: "2026-05-30",
    nights: 2,
    total: 9000,
    status: "Checked-in" as const,
  },
  {
    id: "BK-10296",
    roomId: "garden-cottage",
    guest: "Mali T.",
    checkIn: "2026-05-20",
    checkOut: "2026-05-22",
    nights: 2,
    total: 3700,
    status: "Checked-out" as const,
  },
  {
    id: "BK-10297",
    roomId: "terracotta-suite",
    guest: "Phongsak L.",
    checkIn: "2026-06-12",
    checkOut: "2026-06-14",
    nights: 2,
    total: 6400,
    status: "Cancelled" as const,
  },
];

export const MOCK_REVIEWS = [
  {
    id: "r1",
    roomId: "terracotta-suite",
    author: "Pim",
    rating: 5,
    date: "2026-05-12",
    text: "บรรยากาศดีมาก ห้องสะอาด พนักงานน่ารัก กลับมาแน่นอน",
  },
  {
    id: "r2",
    roomId: "terracotta-suite",
    author: "Ken",
    rating: 5,
    date: "2026-04-28",
    text: "สวนสวย เช้าๆ นั่งจิบกาแฟดูพระอาทิตย์ขึ้นได้สบาย",
  },
  {
    id: "r3",
    roomId: "riverside-villa",
    author: "Aom",
    rating: 4.5,
    date: "2026-05-02",
    text: "วิวแม่น้ำสวยมาก เหมาะกับฮันนีมูน",
  },
];
