"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import api from '@/lib/api';
import { TransactionDetail } from "@/interfaces";

export default function TransactionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTransaction = async () => {
      try {
        const res = await api.get(`/transactions/${id}`);
        setTransaction(res.data);
      } catch {
        toast.error("Failed to fetch transaction.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading transaction...</p>;
  if (!transaction)
    return (
      <p className="text-center p-6 text-red-500">Transaction not found.</p>
    );

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transaction Detail</h1>

      <div className="space-y-4">
        <div className="border p-4 rounded shadow">
          <h2 className="text-lg font-bold">{transaction.Event.name}</h2>
          <p className="text-gray-600">{transaction.Event.location}</p>
          <p className="text-gray-500 text-sm">
            {transaction.Event.startDate
              ? new Date(transaction.Event.startDate).toLocaleDateString()
              : 'Tanggal tidak tersedia'}
          </p>
        </div>

        <div className="border p-4 rounded shadow">
          <p>
            <strong>Quantity:</strong> {transaction.ticket_quantity}
          </p>
          <p>
            <strong>Total:</strong> IDR {transaction.total_price.toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {transaction.status.replaceAll('_', ' ').toUpperCase()}
          </p>
        </div>

        {transaction.payment_proof ? (
          <div className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Payment Proof</h3>
            <div className="relative w-full h-64">
              <Image
                src={transaction.payment_proof}
                alt="Payment Proof"
                fill
                className="object-contain rounded"
              />
            </div>
          </div>
        ) : transaction.status === 'waiting_payment' ? (
          <button
            onClick={() => router.push(`/transactions/${transaction.id}/upload`)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
          >
            Upload Payment Proof
          </button>
        ) : null}

        {transaction.status === 'done' && (
          <p className="text-green-600 text-center mt-6 font-bold">✅ Transaction Completed</p>
        )}
      </div>
    </main>
  );
}
