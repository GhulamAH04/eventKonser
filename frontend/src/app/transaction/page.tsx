"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type Transaction = {
  id: string;
  totalPrice: number;
  status: string;
  event?: {
    name: string;
  };
};

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading)
    return <p className="text-center p-6">Loading transactions...</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-600">No transactions found.</p>
      ) : (
        <div className="grid gap-4">
          {transactions.map((trx) => (
            <div
              key={trx.id}
              className="border p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="font-bold text-lg mb-2">
                {trx.event?.name || "Unknown Event"}
              </h2>

              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    trx.status === "done"
                      ? "bg-green-100 text-green-700"
                      : trx.status.includes("waiting")
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {trx.status.replaceAll("_", " ").toUpperCase()}
                </span>

                <p className="text-gray-600 text-sm">
                  IDR {trx.totalPrice.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => router.push(`/transactions/${trx.id}`)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
