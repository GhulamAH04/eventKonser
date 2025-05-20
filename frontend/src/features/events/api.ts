// src/features/events/api.ts
import api from "@/lib/api";
import { Event } from "@/interfaces";

export const getAllEvents = async (): Promise<Event[]> => {
  const res = await api.get("/events");
  return res.data;
};
