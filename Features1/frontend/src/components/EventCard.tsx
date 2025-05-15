import { Event } from '@/interfaces';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 gap-4 group overflow-hidden"
    >
      {/* ✅ Gambar dengan auto-crop */}
      {event.image_url && (
        <div className="w-full h-48 relative rounded-lg overflow-hidden">
          <Image
            src={event.image_url}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Judul */}
      <h3 className="text-xl font-bold text-sky-700 group-hover:underline">{event.name}</h3>

      {/* Lokasi */}
      <div className="text-gray-500 text-sm">{event.location}</div>

      {/* Tanggal */}
      <div className="text-gray-600 text-sm">
        {format(new Date(event.startDate), 'dd MMM yyyy')} –{' '}
        {event.endDate ? format(new Date(event.endDate), 'dd MMM yyyy') : 'TBA'}
        {differenceInDays(new Date(event.startDate), new Date()) <= 5 &&
          differenceInDays(new Date(event.startDate), new Date()) >= 0 && (
            <span className="ml-2 text-xs text-red-600 font-semibold bg-red-100 px-2 py-0.5 rounded-full">
              🕒 {differenceInDays(new Date(event.startDate), new Date())} days left
            </span>
          )}
      </div>

      {/* Harga & badge */}
      <div className="mt-auto flex justify-between items-center">
        {event.price === 0 && (
          <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
            FREE
          </span>
        )}
        <span className="text-right font-bold text-sky-600 text-lg ml-auto">
          {event.price === 0 ? '' : `Rp ${event.price.toLocaleString('id-ID')}`}
        </span>
      </div>
    </Link>
  );
}
