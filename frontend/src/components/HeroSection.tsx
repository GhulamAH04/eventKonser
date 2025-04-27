'use client';

import { useState } from 'react';

const categories = ['Jazz', 'J-Pop', 'K-Pop', 'Rock', 'Indie', 'EDM'];
const locations = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta'];

export default function HeroSection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  return (
    <section className="w-full flex flex-col items-center text-center bg-gradient-to-b from-sky-100 to-sky-200 py-20 px-4 rounded-b-3xl shadow-inner">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700 mb-4 leading-tight">
        Temukan Tiket Konser <br /> Favoritmu 🎶
      </h1>
      {/* Subtitle */}
      <p className="text-lg text-sky-600 mb-8">
        Cari event seru di kotamu dan nikmati konser impianmu dengan mudah!
      </p>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'text-sky-700 border-sky-300'
              } hover:bg-sky-500 hover:text-white transition text-sm font-semibold`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {locations.map((loc) => (
          <button
            key={loc}
            onClick={() => setSelectedLocation(loc === selectedLocation ? '' : loc)}
            className={`px-4 py-2 rounded-full border ${
              selectedLocation === loc
                ? 'bg-sky-500 text-white border-sky-500'
                : 'text-sky-700 border-sky-300'
            } hover:bg-sky-500 hover:text-white transition text-sm font-semibold`}
          >
            {loc}
          </button>
        ))}
      </div>
    </section>
  );
}
