'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import EventCard from '@/components/EventCard';
import Footer from '@/components/Footer';
import { fetchEvents, Event } from '@/features/events/eventService';

const categories = ['Jazz', 'J-Pop', 'K-Pop', 'Rock', 'Indie', 'EDM'];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getEvents() {
      setIsLoading(true);
      try {
        const eventsData = await fetchEvents(search, category);
        setEvents(eventsData || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }
    getEvents();
  }, [search, category]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* ✅ Navbar hanya menerima search dan setSearch */}
      <Navbar search={search} setSearch={setSearch} />

      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 pt-32 pb-8 gap-8">
        {/* Promo of the Week */}
        <section className="w-full">
          <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white rounded-2xl p-6 text-center shadow-md">
            <h2 className="text-2xl font-bold mb-2">🔥 Promo of the Week 🔥</h2>
            <p className="text-lg">Get up to 30% off for your favorite concerts!</p>
          </div>
        </section>

        {/* Hero Section */}
        <HeroSection />

        {/* Popular Genres */}
        <section className="w-full mt-8">
          <h2 className="text-center text-2xl font-bold mb-4 text-sky-700">Popular Genres</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((genre) => (
              <button
                key={genre}
                onClick={() => setCategory(genre)}
                className={`border ${
                  category === genre ? 'bg-sky-500 text-white' : 'border-sky-500 text-sky-600'
                } rounded-full px-4 py-1 text-sm font-semibold hover:bg-sky-500 hover:text-white transition cursor-pointer`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        {/* Event List */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-500">Loading events...</div>
          ) : events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="col-span-full text-center text-gray-500">
              Tidak ada event ditemukan.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
