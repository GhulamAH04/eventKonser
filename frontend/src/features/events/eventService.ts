// src/features/events/eventService.ts
import axios from "axios";

export interface Event {
  id: number;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  price: number;
  // tambah field lain sesuai database kamu
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await axios.get<Event[]>('http://localhost:3001/api/events');
  return response.data;
}
