import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Room } from "@/data/rooms";
import { Button } from "@/components/ui/button";
import { useRooms, useDeleteRoom } from "@/hooks/useRooms";
import { useState } from "react";
import { RoomFormDialog } from "@/components/admin/RoomFormDialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/rooms")({
  component: AdminRooms,
});

function AdminRooms() {
  const { data: rooms = [], isLoading } = useRooms();
  const deleteRoom = useDeleteRoom();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingRoomId) return;
    try {
      await deleteRoom.mutateAsync(deletingRoomId);
      toast.success("ลบห้องพักสำเร็จ");
    } catch (error: any) {
      toast.error(`เกิดข้อผิดพลาดในการลบ: ${error.message}`);
    } finally {
      setDeletingRoomId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Rooms</p>
          <h1 className="font-serif text-4xl">จัดการห้องพัก</h1>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-1 h-4 w-4" /> เพิ่มประเภทห้อง
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">ห้องพัก</th>
              <th className="px-5 py-3 font-medium">ประเภท</th>
              <th className="px-5 py-3 font-medium">รับสูงสุด</th>
              <th className="px-5 py-3 font-medium">ราคา / คืน</th>
              <th className="px-5 py-3 font-medium">จำนวนรีวิว</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  ยังไม่มีข้อมูลห้องพัก
                </td>
              </tr>
            ) : (
              rooms.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={r.image} alt="" className="h-10 w-14 rounded-md object-cover border border-border" />
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.beds} · {r.size} ตร.ม.</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{r.type}</td>
                  <td className="px-5 py-4">{r.capacity} ท่าน</td>
                  <td className="px-5 py-4">฿{r.price.toLocaleString()}</td>
                  <td className="px-5 py-4">{r.reviews_count ?? r.reviewsCount} รีวิว</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => handleEdit(r)} className="mr-1 rounded-md p-2 hover:bg-secondary transition"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeletingRoomId(r.id)} className="rounded-md p-2 text-destructive hover:bg-destructive/10 transition"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RoomFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        room={editingRoom} 
      />

      <AlertDialog open={!!deletingRoomId} onOpenChange={(v) => !v && setDeletingRoomId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบห้องพัก</AlertDialogTitle>
            <AlertDialogDescription>
              การกระทำนี้ไม่สามารถย้อนกลับได้ ห้องพักรหัส "{deletingRoomId}" จะถูกลบออกจากฐานข้อมูล
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              ลบข้อมูล
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
