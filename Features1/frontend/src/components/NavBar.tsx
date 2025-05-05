'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
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
        {/* Logo (Teks "EventKonser" yang mengarah ke Home) */}
        <Link href="/" className="text-2xl font-bold text-sky-600">
          EventKonser
        </Link>

        {/* Optional: search bar or authentication buttons can go here */}
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
