'use client';

import { useEffect, useState } from 'react';
import {
  getAllTransactions,
  confirmTransaction,
  rejectTransaction,
  Transaction,
} from '@/features/transactions/transactionService';
import Footer from '@/components/Footer';
import Navbar from '@/components/NavBar';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AdminTransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch admin transactions:', error);
      }
    }
    fetchTransactions();
  }, []);

 const handleConfirm = async (id: string) => {
   try {
     await confirmTransaction(id);
     toast.success('Transaksi dikonfirmasi!');
     location.reload();
   } catch (error) {
     console.error(error);
     toast.error('Gagal konfirmasi transaksi.');
   }
 };

 const handleReject = async (id: string) => {
   try {
     await rejectTransaction(id);
     toast.success('Transaksi ditolak.');
     location.reload();
   } catch (error) {
     console.error(error);
     toast.error('Gagal menolak transaksi.');
   }
 };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar />
      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-8 mt-24">
        <h1 className="text-3xl md:text-5xl font-bold text-sky-700 text-center">
          Dashboard Ad min - Konfirmasi Pembayaran
        </h1>

        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-600">Belum ada transaksi menunggu konfirmasi.</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 flex flex-col gap-2">
                <p>
                  <span className="font-semibold">User:</span> {transaction.userName}
                </p>
                <p>
                  <span className="font-semibold">Event:</span> {transaction.eventName}
                </p>
                <p>
                  <span className="font-semibold">Jumlah Tiket:</span> {transaction.ticket_quantity}
                </p>
                <p>
                  <span className="font-semibold">Total Harga:</span> Rp{' '}
                  {transaction.total_price.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {transaction.status}
                </p>

                {transaction.payment_proof && (
                  <Image
                    src={transaction.payment_proof}
                    alt="Bukti Pembayaran"
                    width={300}
                    height={200}
                    className="h-40 object-contain rounded-md border my-2"
                  />
                )}

                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handleConfirm(transaction.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Konfirmasi
                  </button>
                  <button
                    onClick={() => handleReject(transaction.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}