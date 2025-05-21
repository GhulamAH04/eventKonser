"use client"

import EventForm from "@/components/EventForm";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Event } from "@/interfaces";
import { jwtDecode } from "jwt-decode";

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
      const token = localStorage.getItem('token');
      const decoded = token ? jwtDecode<{ id: string }>(token) : null;
      console.log(' Decoded token:', decoded);
      if (!decoded) {
        toast.error('Unauthorized');
        return;
      }
      console.log('Organizer ID dari frontend:', decoded.id);

      await api.post('/events', {
        ...data,
        organizer_id: decoded.id,
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
