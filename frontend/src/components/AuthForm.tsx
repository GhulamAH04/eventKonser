'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import axios from 'axios';
import { AuthFormProps } from '@/interfaces';

export default function AuthForm({ type, role }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const endpoint = type === 'register' ? '/register' : '/login';

      const payload =
        type === 'register'
          ? {
              email,
              password,
              role: role.toUpperCase(), // CUSTOMER | ORGANIZER
              full_name: fullName,
              referral_code: referralCode || '',
            }
          : { email, password, role: role.toUpperCase() };

      const res = await api.post(endpoint, payload);

      if (type === 'login') {
        localStorage.setItem('accessToken', res.data.accessToken);
        router.push(role === 'organizer' ? '/dashboard' : '/');
      } else {
        alert('Registration successful!');
        router.push('/login');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        alert('Failed: ' + err.response.data.message);
      } else {
        alert('Unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">
        {type === 'register' ? 'Register' : 'Login'} as {role}
      </h1>

      {type === 'register' && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Referral Code (optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="border px-4 py-2 rounded"
          />
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        className="border px-4 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border px-4 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700 transition"
      >
        {type === 'register' ? 'Register' : 'Login'}
      </button>
    </form>
  );
}
