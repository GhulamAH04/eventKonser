"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/NavBar";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { fetchEvents, Event } from "../features/events/eventService";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function getEvents() {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }
    getEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />
      <HeroSection />
      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-8 gap-8">
        <SearchBar />

        {/* Static Promo */}
        <section className="w-full mt-12">
          <div className="bg-blue-100 text-blue-800 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">🔥 Promo of The Week 🔥</h2>
            <p className="text-lg">
              Get up to 30% off for your favorite concerts!
            </p>
          </div>
        </section>

        {/* Event List */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
