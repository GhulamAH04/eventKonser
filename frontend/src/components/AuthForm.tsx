'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AuthFormProps } from '@/interfaces';
import { jwtDecode } from 'jwt-decode';
import { isAxiosError } from 'axios';

export default function AuthForm({ type, role }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const endpoint = type === 'register' ? '/auth/register' : '/auth/login';

      const payload =
        type === 'register'
          ? {
              email,
              password,
              role: role.toUpperCase(), // 'CUSTOMER' | 'ORGANIZER'
              full_name: fullName,
              referral_code: referralCode || undefined,
            }
          : {
              email,
              password,
              role: role.toUpperCase(),
            };

      const res = await api.post(endpoint, payload);
      console.log('Login response:', res.data);

      if (type === 'login') {
        const token = res.data?.token;
        if (!token) {
          throw new Error('Access token not received');
        }

        localStorage.setItem('token', token);

        // Decode JWT token
        const decoded: { id: string; email: string; role: string } = jwtDecode(token);
        console.log('Decoded token:', decoded); // <== ini tampilkan id-nya
        const userRole = decoded.role?.toLowerCase();

        // Redirect based on role
        router.push(userRole === 'organizer' ? '/dashboard' : '/');
      } else {
        alert('Registration successful!');
        router.push('/login');
      }
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        const errorMsg =
          err.response.data?.message || JSON.stringify(err.response.data) || 'Unknown error';
        alert('Failed: ' + errorMsg);
      } else {
        console.error('Unexpected error:', err);
        alert('Unexpected error occurred');
      }
    }

  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border px-4 py-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border px-4 py-2 rounded"
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
