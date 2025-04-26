"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-6 flex flex-col gap-12 bg-white text-gray-900">
      {/* Navbar */}
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">EventKonser</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Signup
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-2">Book Concert Tickets Online</h2>
        <p className="text-gray-600 text-lg">
          Easy, safe, and affordable access to live music experiences.
        </p>
        <div className="mt-6">
          <Link href="/events">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Start Exploring
            </button>
          </Link>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
        {[
          { href: "/events", label: "🎟️ Browse Events" },
          { href: "/create-event", label: "📅 Create Event" },
          { href: "/transactions", label: "🛒 My Transactions" },
          { href: "/review", label: "⭐ Review Event" },
          { href: "/dashboard", label: "📂 Organizer Dashboard" },
          { href: "/login", label: "🔐 Login / Signup" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="p-6 border rounded shadow hover:shadow-md transition"
          >
            {item.label}
          </Link>
        ))}
      </section>

      {/* Genres */}
      <section className="text-center">
        <h3 className="text-2xl font-bold mb-4">Popular Genres</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {["Jazz", "J-Pop", "K-Pop", "Rock", "Indie", "EDM"].map((genre) => (
            <span
              key={genre}
              className="px-4 py-2 border rounded-full text-sm hover:bg-blue-50"
            >
              {genre}
            </span>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 border-t pt-6">
        © 2025 EventKonser. All rights reserved.
      </footer>
    </main>
  );
}
