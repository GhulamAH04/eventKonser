'use client';

import { useState } from 'react';
import Navbar from '@/components/NavBar';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const [role, setRole] = useState<'customer' | 'organizer'>('customer');
  const [search, setSearch] = useState('');

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <Navbar search={search} setSearch={setSearch} />

      <div className="bg-blue-100 p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-gray-600">
          {role === 'customer'
            ? 'Login to browse and buy concert tickets.'
            : 'Login to manage your events.'}
        </p>
      </div>

      <div className="p-10 flex flex-col justify-center">
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

        <AuthForm type="login" role={role} />
      </div>
    </main>
  );
}
