'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import EventCard from '@/components/EventCard';
import Footer from '@/components/Footer';
import { fetchEvents } from '@/features/events/eventService';
import { Event } from '@/interfaces';
import { useDebounce } from '@/hooks/useDebounce'; // 

const categories = ['Jazz', 'J-Pop', 'K-Pop', 'Rock', 'Indie', 'EDM'];
const locations = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta'];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const debouncedSearch = useDebounce(search, 500); //  debounce 500ms

  useEffect(() => {
    async function getEvents() {
      setIsLoading(true);
      try {
        const eventsData = await fetchEvents(debouncedSearch, category, location);
        setEvents(eventsData || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    getEvents();
  }, [debouncedSearch, category, location]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar search={search} setSearch={setSearch} />

      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 pt-32 pb-8 gap-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Popular Genres */}
        <section className="w-full mt-12">
          <h2 className="text-center text-2xl font-bold mb-6 text-sky-700">Popular Genres</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((genre) => (
              <button
                key={genre}
                onClick={() => setCategory(genre)}
                className={`border ${
                  category === genre ? 'bg-sky-500 text-white' : 'border-sky-400 text-sky-600'
                } rounded-full px-5 py-2 text-sm font-semibold transition duration-300 
                hover:bg-sky-500 hover:text-white hover:shadow-lg hover:scale-105`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        {/* Popular Locations */}
        <section className="w-full mt-12">
          <h2 className="text-center text-2xl font-bold mb-6 text-sky-700">Popular Locations</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`border ${
                  location === loc ? 'bg-sky-500 text-white' : 'border-sky-400 text-sky-600'
                } rounded-full px-5 py-2 text-sm font-semibold transition duration-300 
                hover:bg-sky-500 hover:text-white hover:shadow-lg hover:scale-105`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* GA JADI KARENA GAGAL SORTING 
          Sort Events 
          <div className="w-full mt-6 flex justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-sky-300 text-sky-700 rounded-md px-4 py-2 shadow-sm bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
            >
              <option value="newest">Sort by Newest</option>
              <option value="soonest">Sort by Soonest</option>
              <option value="cheapest">Sort by Cheapest</option>
              <option value="expensive">Sort by Most Expensive</option>
            </select>
          </div> */}
          

          {/* 🔄 Reset Filter Button */}
          {(category || location) && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setCategory('');
                  setLocation('');
                }}
                className="text-sm text-gray-600 underline hover:text-sky-600 transition"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* Event List */}
        <section
          id="event-list"
          className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12"
        >
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
