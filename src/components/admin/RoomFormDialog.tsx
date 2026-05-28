import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRoom, useUpdateRoom } from "@/hooks/useRooms";
import { Room } from "@/data/rooms";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";

type RoomFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room | null;
};

export function RoomFormDialog({ open, onOpenChange, room }: RoomFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Room>>({
    id: "",
    name: "",
    type: "Room",
    price: 1000,
    capacity: 2,
    beds: "1 Double",
    size: 20,
    image: "",
    description: "",
    cancellation: "ยกเลิกฟรี 24 ชม. ล่วงหน้า",
    amenities: ["wifi", "ac"],
    rating: 5,
    reviewsCount: 0,
    gallery: [],
  });
  
  const [isUploading, setIsUploading] = useState(false);

  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();

  const isEditing = !!room;

  useEffect(() => {
    if (room && open) {
      setFormData(room);
    } else if (!open) {
      // Reset when closed
      setFormData({
        id: "",
        name: "",
        type: "Room",
        price: 1000,
        capacity: 2,
        beds: "1 Double",
        size: 20,
        image: "",
        description: "",
        cancellation: "ยกเลิกฟรี 24 ชม. ล่วงหน้า",
        amenities: ["wifi", "ac"],
        rating: 5,
        reviewsCount: 0,
        gallery: [],
      });
    }
  }, [room, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "capacity", "size"].includes(name) ? Number(value) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `rooms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('room-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
      
      setFormData((prev) => ({ ...prev, image: data.publicUrl }));
      toast.success("อัปโหลดรูปภาพสำเร็จ");
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.image) {
      toast.error("กรุณากรอกรหัสห้อง ชื่อห้อง และรูปภาพให้ครบถ้วน");
      return;
    }

    try {
      if (isEditing) {
        await updateRoom.mutateAsync({ id: formData.id, ...formData } as Room);
        toast.success("อัปเดตห้องพักสำเร็จ");
      } else {
        await createRoom.mutateAsync(formData as Omit<Room, "created_at" | "updated_at">);
        toast.success("เพิ่มห้องพักใหม่สำเร็จ");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  const isLoading = createRoom.isPending || updateRoom.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "แก้ไขห้องพัก" : "เพิ่มห้องพักใหม่"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID (URL Slug)*</Label>
              <Input
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={isEditing}
                placeholder="เช่น pool-villa"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อห้องพัก*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="เช่น Riverside Pool Villa"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">ประเภท</Label>
              <Input id="type" name="type" value={formData.type} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">ราคา / คืน (บาท)*</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">รับสูงสุด (ท่าน)</Label>
              <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">ขนาด (ตร.ม.)</Label>
              <Input id="size" name="size" type="number" value={formData.size} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="beds">เตียง</Label>
              <Input id="beds" name="beds" value={formData.beds} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancellation">นโยบายยกเลิก</Label>
              <Input id="cancellation" name="cancellation" value={formData.cancellation} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียด</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>รูปภาพหลัก*</Label>
            <div className="flex items-end gap-4">
              {formData.image && (
                <div className="h-24 w-32 shrink-0 overflow-hidden rounded-md border border-border">
                  <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="URL รูปภาพ หรืออัปโหลดไฟล์"
                  required
                />
                <div className="relative">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isEditing ? "บันทึกการแก้ไข" : "เพิ่มห้องพัก"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
