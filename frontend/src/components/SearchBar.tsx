'use client';

import { useState, useEffect } from 'react';
import { SearchBarProps } from '@/interfaces';

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <input
      type="text"
      placeholder="Cari Event..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-sky-300"
    />
  );
}
