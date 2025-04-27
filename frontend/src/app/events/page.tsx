"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Event } from "@/interface/event";
import EventCard from "@/components/EventCard";

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data));
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Events</h1>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}
