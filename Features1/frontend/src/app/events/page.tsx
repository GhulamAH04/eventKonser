'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { fetchEvents } from '@/features/events/eventService';
import { Event } from '@/interfaces';
import EventCard from '@/components/EventCard';
import { useDebounce } from '@/hooks/useDebounce';

const categories = ['Jazz', 'J-Pop', 'K-Pop', 'Rock', 'Indie', 'EDM'];
const locations = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta'];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        const data = await fetchEvents(debouncedSearch, category, location, sortBy);
        setEvents(data || []);
      } catch (error) {
        console.error('Gagal ambil event:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [debouncedSearch, category, location, sortBy]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar search={search} setSearch={setSearch} />
      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 pt-32 pb-8 gap-10">
        <h1 className="text-3xl font-bold text-sky-700">Explore All Events</h1>

        {/* Filter: Categories */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((genre) => (
            <button
              key={genre}
              onClick={() => setCategory(genre)}
              className={`border ${
                category === genre ? 'bg-sky-500 text-white' : 'border-sky-400 text-sky-600'
              } rounded-full px-5 py-2 text-sm font-semibold transition hover:bg-sky-500 hover:text-white`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Filter: Locations */}
        <div className="flex flex-wrap justify-center gap-3">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocation(loc)}
              className={`border ${
                location === loc ? 'bg-sky-500 text-white' : 'border-sky-400 text-sky-600'
              } rounded-full px-5 py-2 text-sm font-semibold transition hover:bg-sky-500 hover:text-white`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Sort Events*/}
        <div className="w-full mt-6 flex justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-sky-300 text-sky-700 rounded-md px-4 py-2 shadow-sm bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
          >
            <option value="newest">Sort by Newest</option>
            <option value="soonest">Sort by Soonest</option>
            <option value="popular">Sort by Popular</option>
          </select>
        </div>

        {/* Event List */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="col-span-full text-center text-gray-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No events found.</p>
          ) : (
            events.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
