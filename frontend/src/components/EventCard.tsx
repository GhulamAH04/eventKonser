// src/components/EventCard.tsx
import { Event } from "../features/events/eventService";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="h-40 bg-slate-200"></div> {/* Image Placeholder */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-800">{event.name}</h3>
        <p className="text-slate-600 text-sm">
          {event.location} - {new Date(event.start_date).toLocaleDateString()}
        </p>
        <p className="mt-2 text-sky-500 font-bold">
          IDR {event.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
