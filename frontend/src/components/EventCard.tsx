'use client';

import { Event } from '@/features/events/eventService';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-xl">
        {/* Placeholder gambar */}
        {event.name.slice(0, 20)}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-800">{event.name}</h3>
        <p className="text-sm text-gray-500">{new Date(event.start_date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">{event.location}</p>
        <p className="text-md font-semibold text-sky-600">
          {event.price === 0 ? 'Gratis' : `Rp ${event.price.toLocaleString()}`}
        </p>
        <Link
          href={`/events/${event.id}`}
          className="mt-3 inline-block text-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
