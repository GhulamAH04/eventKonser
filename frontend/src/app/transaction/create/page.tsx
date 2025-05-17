'use client';

import { useSearchParams } from 'next/navigation';

export default function CreateTransactionPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center bg-slate-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-sky-700">Beli Tiket</h1>

        <p className="mb-2 text-sm text-gray-600">
          Event ID: <span className="font-mono">{eventId}</span>
        </p>

        <form>
          <label className="block mb-2">
            Jumlah Tiket:
            <input
              type="number"
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Contoh: 2"
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full bg-sky-600 text-white font-semibold py-2 rounded-md hover:bg-sky-700 transition"
          >
            Bayar Sekarang
          </button>
        </form>
      </div>
    </main>
  );
}
