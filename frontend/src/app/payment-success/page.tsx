'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { TransactionDetail } from '@/interfaces/transaction';
import toast from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!transactionId) return;

    fetch(`http://localhost:3001/api/transactions/${transactionId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not Found');
        return res.json();
      })
      .then((data) => setTransaction(data))
      .catch(() => toast.error('Gagal mengambil data transaksi'));
  }, [transactionId]);

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar search="" setSearch={() => {}} />
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 gap-6 mt-24 text-center">
        <h1 className="text-4xl font-bold text-sky-700">Pembayaran Berhasil!</h1>

        {transaction ? (
          <>
            <p className="text-gray-600 text-lg max-w-md">
              Kamu telah membeli <b>{transaction.ticket_quantity}</b> tiket untuk acara{' '}
              <b>{transaction.Event.name}</b>. Total pembayaran sebesar{' '}
              <b>Rp {transaction.total_price.toLocaleString('id-ID')}</b>.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Status:{' '}
              <span className="text-sky-600 font-semibold uppercase">{transaction.status}</span>
            </p>
          </>
        ) : (
          <p className="text-gray-400">Memuat detail transaksi...</p>
        )}

        <button
          onClick={() => router.push('/')}
          className="mt-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Kembali ke Home
        </button>
      </main>
      <Footer />
    </div>
  );
}
