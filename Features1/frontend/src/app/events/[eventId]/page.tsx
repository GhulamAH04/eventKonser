'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getEventById } from '@/features/events/eventService';
import { Event } from '@/interfaces';
import Link from 'next/link';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // JWT token
    setIsLoggedIn(!!token);
  }, []);

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
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700 text-center">
          {event.name}
        </h1>

        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-gray-600 font-semibold">Start Date</h2>
              <p className="text-sky-700">{new Date(event.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h2 className="text-gray-600 font-semibold">End Date</h2>
              <p className="text-sky-700">
                {event.endDate ? new Date(event.endDate).toLocaleDateString() : 'TBA'}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-gray-600 font-semibold">Location</h2>
            <p className="text-sky-700">{event.location}</p>
          </div>

          <div>
            <h2 className="text-gray-600 font-semibold">Description</h2>
            <p className="text-gray-700">{event.description || 'No description available.'}</p>
          </div>

          {event.promotion && event.promotion.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <p className="text-yellow-700 font-medium">
                 Promo Available: <span className="font-bold">{event.promotion[0].code}</span> –
                Get discount up to Rp {event.promotion[0].discount.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-yellow-500 mt-1">
                Valid until {new Date(event.promotion[0].endDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {/* Price & Remaining Seats */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-sky-600 font-bold text-2xl">
              {typeof event.price === 'number'
                ? event.price === 0
                  ? 'FREE'
                  : `Rp ${event.price.toLocaleString('id-ID')}`
                : 'Price not available'}
            </span>

            <div className="text-sm text-gray-500 mt-2">
              Remaining Seats:{' '}
              <span className="font-semibold text-sky-700">{event.remaining_seats}</span>
            </div>

            <Link
              href={`/events/${event.id}/checkout`}
              className="mt-4 inline-block bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-full transition"
            >
              Buy Ticket
            </Link>

            <Link
              href={`/organizers/${event.organizer_id}`}
              className="text-sky-500 hover:underline text-sm font-semibold mt-2"
            >
              View Organizer Profile →
            </Link>
          </div>
          <Link
            href={`/events/${event.id}/checkout`}
            className="mt-4 inline-block bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-full transition"
          >
            Buy Ticket
          </Link>

          {/* ✅ Buy Ticket Button */}
          {isLoggedIn && event.remaining_seats > 0 && (
            <button
              onClick={() => router.push(`/transactions/create/${event.id}`)}
              className="mt-6 bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-sky-700 transition"
            >
              Buy Ticket
            </button>
          )}
          {!isLoggedIn && (
            <p className="text-sm text-red-500 mt-4 text-center">
              You must{' '}
              <Link href="/login" className="underline font-semibold">
                log in
              </Link>{' '}
              to buy tickets.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
