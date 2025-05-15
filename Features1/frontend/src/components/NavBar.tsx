'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { NavbarProps } from '@/interfaces';
import { UserTokenPayload } from '@/interfaces/user'; // buat interface payload jwt
import { LogOut } from 'lucide-react';

export default function Navbar({ search, setSearch }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserTokenPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: UserTokenPayload = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-sky-600">
          EventKonser
        </Link>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="hidden md:block px-4 py-2 rounded-full border border-gray-300 w-1/2 text-sm"
        />

        {/* Right menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Role-based button */}
              {user.role === 'ORGANIZER' ? (
                <Link
                  href="/dashboard"
                  className="text-sm text-sky-700 font-semibold hover:underline"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/my-tickets"
                  className="text-sm text-sky-700 font-semibold hover:underline"
                >
                  My Tickets
                </Link>
              )}

              {/* Username & Logout */}
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                <span className="hidden sm:inline">Hi, {user.full_name}</span>
                <button onClick={handleLogout} className="hover:text-red-600">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sky-600 font-semibold hover:underline text-sm">
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
