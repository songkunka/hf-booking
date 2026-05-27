import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import room4 from "@/assets/room-4.jpg";

export type Room = {
  id: string;
  name: string;
  type: string;
  location: string;
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
    location: "Chiang Mai · Old City",
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
      "ห้องสวีทโทนเทอร์ราคอตต้าอบอุ่น มองเห็นสวนส่วนตัว ตกแต่งสไตล์มินิมอลตะวันออก พร้อมเตียงคิงไซส์และสปาในห้องน้ำ",
    cancellation: "ยกเลิกฟรีก่อนเช็คอิน 48 ชั่วโมง",
  },
  {
    id: "ocean-villa",
    name: "Ocean Breeze Villa",
    type: "Villa",
    location: "Phuket · Kata Beach",
    price: 6800,
    rating: 4.95,
    reviewsCount: 312,
    capacity: 4,
    beds: "2 Queen",
    size: 78,
    image: room2,
    gallery: [room2, room1, room4],
    amenities: ["wifi", "breakfast", "pool", "ac", "beach", "parking"],
    description:
      "วิลล่าริมหาดส่วนตัว เห็นวิวอันดามันเต็มตา มุ้งผ้าลินิน เฟอร์นิเจอร์หวาย และระเบียงชมพระอาทิตย์ตก",
    cancellation: "ยกเลิกฟรีก่อนเช็คอิน 7 วัน",
  },
  {
    id: "garden-cottage",
    name: "Hidden Garden Cottage",
    type: "Cottage",
    location: "Pai · Mae Hong Son",
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
      "กระท่อมไม้หลังเล็กท่ามกลางสวน บรรยากาศเงียบสงบ เหมาะกับคนที่อยากหลบความวุ่นวาย",
    cancellation: "ยกเลิกฟรีก่อนเช็คอิน 24 ชั่วโมง",
  },
  {
    id: "skyline-loft",
    name: "Skyline Loft",
    type: "Loft",
    location: "Bangkok · Sathorn",
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
      "ลอฟต์ใจกลางเมือง วิวสกายไลน์ 270 องศา ตกแต่งสไตล์โมเดิร์น พร้อมสระว่ายน้ำชั้นดาดฟ้า",
    cancellation: "ยกเลิกฟรีก่อนเช็คอิน 48 ชั่วโมง",
  },
];

export const AMENITY_LABELS: Record<string, string> = {
  wifi: "Wi-Fi ฟรี",
  breakfast: "อาหารเช้า",
  pool: "สระว่ายน้ำ",
  ac: "เครื่องปรับอากาศ",
  garden: "สวน",
  beach: "ติดชายหาด",
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
    roomId: "ocean-villa",
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
    roomId: "ocean-villa",
    author: "Aom",
    rating: 4.5,
    date: "2026-05-02",
    text: "วิวทะเลสวยมาก เหมาะกับฮันนีมูน",
  },
];
