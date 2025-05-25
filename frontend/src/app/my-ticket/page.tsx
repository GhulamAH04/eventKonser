'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { TransactionDetail } from '@/interfaces'; // Menggunakan transaksi yang sudah digabung
import { getUserFromToken } from '@/lib/auth';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function MyTicketPage() {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const user = getUserFromToken();

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await api.get('/transactions/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
        });
        setTransactions(res.data); // Menyimpan data transaksi yang didapat
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Please login to view your tickets.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar search="" setSearch={() => {}} />

      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Tickets</h1>

        {loading ? (
          <p>Loading your tickets...</p>
        ) : transactions.length === 0 ? (
          <p>You have no tickets yet.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-white rounded shadow flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <div>
                  <h2 className="font-semibold text-lg">{tx.Event?.name}</h2>
                  <p>Location: {tx.Event?.location || 'Not available'}</p>
                  <p>Quantity: {tx.ticket_quantity}</p>
                  <p>Total Price: Rp {tx.total_price.toLocaleString('id-ID')}</p>
                  <p>
                    Status: <span className="capitalize">{tx.status.replace('_', ' ')}</span>
                  </p>
                </div>

                {tx.payment_proof && (
                  <Image
                    src={tx.payment_proof}
                    alt="Payment Proof"
                    width={120}
                    height={80}
                    className="rounded"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
