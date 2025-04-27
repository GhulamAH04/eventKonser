'use client';

import { Event } from '@/features/events/eventService';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 gap-4 animate-fade-in group"
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-sky-700 group-hover:underline">{event.name}</h3>

      {/* Location */}
      <div className="text-gray-500 text-sm">{event.location}</div>

      {/* Date */}
      <div className="text-gray-600 text-sm">
        {new Date(event.start_date).toLocaleDateString()} -{' '}
        {new Date(event.end_date).toLocaleDateString()}
      </div>

      {/* Price */}
      <div className="mt-auto text-right font-bold text-sky-600 text-lg">
        {event.price === 0 ? 'FREE' : `Rp ${event.price.toLocaleString('id-ID')}`}
      </div>
    </Link>
  );
}
