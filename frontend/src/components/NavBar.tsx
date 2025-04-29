'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { NavbarProps } from '@/interfaces/navbarProps';

export default function Navbar({ search, setSearch }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-sky-600">
          eventKonser
        </Link>

        {/* Search Only if search and setSearch exist */}
        {search !== undefined && setSearch !== undefined && (
          <div className="flex-1 flex items-center gap-4">
            <input
              type="text"
              placeholder="Cari event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 text-sm"
            />
          </div>
        )}

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sky-600 font-semibold hover:underline text-sm">
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
