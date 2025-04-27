'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getEventById, Event } from '@/features/events/eventService';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Failed to fetch event detail:', error);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-8 mt-20">
        {/* Hero Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-sky-700 text-center">{event.name}</h1>

        {/* Event Details */}
        <div className="w-full bg-white rounded-lg shadow p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Tanggal Mulai:</h2>
            <p className="text-gray-600">{new Date(event.start_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Tanggal Selesai:</h2>
            <p className="text-gray-600">{new Date(event.end_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Lokasi:</h2>
            <p className="text-gray-600">{event.location}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Deskripsi:</h2>
            <p className="text-gray-600">{event.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Harga Tiket:</h2>
            <p className="text-sky-600 font-bold text-xl">
              {event.price === 0 ? 'Gratis' : `Rp ${event.price.toLocaleString()}`}
            </p>
          </div>
          <button className="mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition">
            Beli Tiket
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
