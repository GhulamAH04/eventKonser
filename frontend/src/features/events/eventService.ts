import api from "@/lib/api";
import { Event } from '@/interfaces';
import { RawEvent, RawVoucher } from '@/interfaces/raw';

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const response = await api.get(`/events/${id}`);
    const raw: RawEvent = response.data.data; // ⬅️ FIX: hanya sekali data

    const mapped: Event = {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      location: raw.location,
      price: raw.price,
      startDate: raw.start_date,
      endDate: raw.end_date,
      organizer_id: raw.organizer_id,
      remaining_seats: raw.remaining_seats,
      promotion: raw.Voucher?.map((v: RawVoucher) => ({
        id: v.id,
        code: v.code,
        discount: v.discount_amount,
        startDate: v.start_date,
        endDate: v.end_date,
      })),
    };

    return mapped;
  } catch (error) {
    console.error('Failed to fetch event by id', error);
    return null;
  }
}

export async function fetchEvents(
  search?: string,
  category?: string,
  location?: string,
  sortBy?: string
): Promise<Event[]> {
  try {
    const response = await api.get('/events', {
      params: { search, category, location, sortBy },
    });

    const rawEvents: RawEvent[] = response.data.data;

    return rawEvents.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      location: e.location,
      price: e.price,
      startDate: e.start_date,
      endDate: e.end_date,
      organizer_id: e.organizer_id,
      remaining_seats: e.remaining_seats,
      promotion: e.Voucher?.map((v: RawVoucher) => ({
        id: v.id,
        code: v.code,
        discount: v.discount_amount,
        startDate: v.start_date,
        endDate: v.end_date,
      })),
    }));
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
}
