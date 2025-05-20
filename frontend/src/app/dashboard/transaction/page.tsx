'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getUserFromToken } from '@/lib/auth';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { TransactionDetail } from '@/interfaces/transaction';
import ProtectedRoute from '@/components/ProtectedRoute'; // dibungkus di dalam halaman

function TransactionDashboard() {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions/organizer');
      setTransactions(res.data);
    } catch {
      toast.error('Gagal memuat transaksi');
    }
  };

  const handleStatusUpdate = async (id: string, status: 'done' | 'rejected') => {
    try {
      await api.patch(`/transactions/${id}/status`, { status });
      toast.success(`Transaksi ${status === 'done' ? 'diterima' : 'ditolak'}`);
      fetchTransactions(); // refresh
    } catch {
      toast.error('Gagal memperbarui status');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <main className="p-6 bg-sky-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manajemen Transaksi</h1>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p>Tidak ada transaksi ditemukan.</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="p-4 border rounded bg-white shadow-md space-y-2">
              <p className="font-semibold text-sky-700">{tx.Event.name}</p>
              <p>Lokasi: {tx.Event.location}</p>
              <p>Email Pembeli: {tx.guestEmail ?? '-'}</p>
              <p>Jumlah Tiket: {tx.ticket_quantity}</p>
              <p>Total Harga: Rp {tx.total_price.toLocaleString('id-ID')}</p>
              <p>
                Status: <span className="font-semibold">{tx.status}</span>
              </p>

              <div className="flex gap-3 mt-2">
                {tx.payment_proof && (
                  <button
                    onClick={() => setSelectedProof(tx.payment_proof!)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Lihat Bukti
                  </button>
                )}
                <button
                  onClick={() => handleStatusUpdate(tx.id, 'done')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Terima
                </button>
                <button
                  onClick={() => handleStatusUpdate(tx.id, 'rejected')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Tolak
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Lihat Bukti */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Bukti Pembayaran</h2>
            <Image
              src={selectedProof}
              alt="Bukti Pembayaran"
              width={500}
              height={300}
              className="rounded"
            />
            <button
              onClick={() => setSelectedProof(null)}
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// Protected + role check wrapper
export default function TransactionsPage() {
  const user = getUserFromToken();

  if (!user || user.role !== 'ORGANIZER') {
    return (
      <main className="p-6 min-h-screen bg-sky-50 flex items-center justify-center">
        <p className="text-lg text-red-600 font-semibold">
          Akses ditolak. Halaman ini hanya untuk Organizer.
        </p>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <TransactionDashboard />
    </ProtectedRoute>
  );
}
