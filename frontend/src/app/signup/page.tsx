'use client';

import { useState } from 'react';
import Navbar from '@/components/NavBar';
import AuthForm from '@/components/AuthForm'; // Tambahkan import ini

export default function SignupPage() {
  const [role, setRole] = useState<'customer' | 'organizer'>('customer');
  const [search, setSearch] = useState('');

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Navbar */}
      <Navbar search={search} setSearch={setSearch} />

      {/* Left Side */}
      <div className="bg-blue-50 p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Join EventKonser</h1>
        <p className="text-gray-600 text-lg">
          {role === 'customer'
            ? 'Attend amazing concerts and enjoy exclusive deals.'
            : 'Host and manage your concerts with ease.'}
        </p>
      </div>

      {/* Right Side */}
      <div className="p-10 flex flex-col justify-center">
        {/* Tab Switcher */}
        <div className="flex gap-6 mb-6">
          <button
            className={`font-semibold ${role === 'customer' ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => setRole('customer')}
          >
            Participant
          </button>
          <button
            className={`font-semibold ${role === 'organizer' ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => setRole('organizer')}
          >
            Organizer
          </button>
        </div>

        {/* Auth Form */}
        <AuthForm type="register" role={role} />
      </div>
    </main>
  );
}
