'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import api from '@/lib/api';

import toast from 'react-hot-toast';
import Image from 'next/image';
// import { User } from '@/interfaces';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  profile_picture?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get('/api/profile'); // sesuaikan route backend kamu
        setUser(res.data.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    }
    fetchUser();
  }, []);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar search={search} setSearch={setSearch} />
      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-8 mt-24">
        <h1 className="text-3xl md:text-5xl font-bold text-sky-700 text-center">Profil Saya</h1>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
          {user.profile_picture && (
            /*
            <image
              src={user.profile_picture}
              alt="Profile Picture"
              className="w-32 h-32 rounded-full object-cover border"
            />
            */
            <Image
              src={user.profile_picture}
              alt="Preview"
              width={300}
              height={300}
              className="h-64 object-contain rounded-lg border mt-4"
            />
          )}

          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-bold">{user.full_name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>

          <button
            onClick={() => toast('Fitur edit coming soon...')}
            className="mt-4 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Edit Profil
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
