'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getEventById } from '@/features/events/eventService';
import { Event } from '@/interfaces';
import Link from 'next/link';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>(); // ✅ Gunakan id, bukan eventId
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Failed to fetch event', error);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  if (!event) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar search="" setSearch={() => {}} />

      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-10 mt-24 animate-fade-in">
        {/* Event Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700 text-center">
          {event.name}
        </h1>

        {/* Event Detail Card */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
          {/* Dates */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-gray-600 font-semibold">Start Date</h2>
              <p className="text-sky-700">{new Date(event.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h2 className="text-gray-600 font-semibold">End Date</h2>
              <p className="text-sky-700">{new Date(event.endDate?).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-gray-600 font-semibold">Location</h2>
            <p className="text-sky-700">{event.location}</p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-gray-600 font-semibold">Description</h2>
            <p className="text-gray-700">{event.description || 'No description available.'}</p>
          </div>

          {/* Price */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-sky-600 font-bold text-2xl">
              {event.price === 0 ? 'FREE' : `Rp ${event.price.toLocaleString('id-ID')}`}
            </span>

            {/* 🔥 View Organizer */}
            <Link
              href={`/organizer/${event.organizer_id}`}
              className="text-sky-500 hover:underline text-sm font-semibold"
            >
              View Organizer Profile →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
