import { Event } from "@/types/event";

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="border rounded-xl shadow p-4 hover:shadow-md transition">
      <h2 className="text-xl font-bold mb-1">{event.name}</h2>
      <p className="text-sm text-gray-600">{event.location}</p>
      <p className="text-sm">
        {new Date(event.startDate).toLocaleDateString()}
      </p>
      <p className="mt-2 text-lg font-semibold">
        {event.price === 0 ? "FREE" : `IDR ${event.price.toLocaleString()}`}
      </p>
    </div>
  );
}
