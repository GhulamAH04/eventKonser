import EventForm from "@/components/EventForm";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Event } from "@/types/event"; // 🔥 Import ini untuk pakai type Event

export default function CreateEventPage() {
  const router = useRouter();
  const handleCreate = async (
    data: Partial<Event> & {
      promotionCode?: string;
      promotionDiscount?: number;
      promotionStartDate?: string;
      promotionEndDate?: string;
    }
  ) => {
    try {
      await api.post("/events", {
        ...data,
        price: Number(data.price),
        promotion: data.promotionCode
          ? {
              code: data.promotionCode,
              discount: Number(data.promotionDiscount),
              startDate: data.promotionStartDate,
              endDate: data.promotionEndDate,
            }
          : undefined,
      });
      toast.success("Event created!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to create event");
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <EventForm onSubmit={handleCreate} />
    </main>
  );
}
