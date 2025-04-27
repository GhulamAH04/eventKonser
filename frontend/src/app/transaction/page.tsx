'use client';

import { useEffect, useState } from 'react';
import { getUserTransactions, Transaction } from '@/features/transactions/transactionService';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TransactionListPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await getUserTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar />
      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-8 mt-24">
        <h1 className="text-3xl md:text-5xl font-bold text-sky-700 text-center">Transaksi Saya</h1>

        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-600">Belum ada transaksi.</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 flex flex-col gap-2">
                <p>
                  <span className="font-semibold">Event:</span> {transaction.eventName}
                </p>
                <p>
                  <span className="font-semibold">Jumlah Tiket:</span> {transaction.ticket_quantity}
                </p>
                <p>
                  <span className="font-semibold">Total:</span> Rp{' '}
                  {transaction.total_price.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {transaction.status}
                </p>

                {transaction.status === 'waiting_payment' && (
                  <Link
                    href={`/payment-proof/${transaction.id}`}
                    className="text-sky-600 font-bold underline mt-2"
                  >
                    Upload Bukti Pembayaran
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
