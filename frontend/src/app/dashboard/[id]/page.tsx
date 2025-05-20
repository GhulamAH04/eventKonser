  "use client";

  import { useEffect, useState, useCallback } from "react";
 import api from '@/lib/api';
  import { useParams } from "next/navigation";
  import { EventTransaction } from '@/interfaces/transaction';
  import Image from "next/image";
  import Link from "next/link";

  export default function EventDetail() {
    const { id } = useParams();
    const [transactions, setTransactions] = useState<EventTransaction[]>([]);

    const loadTransactions = useCallback(async () => {
      const res = await api.get(`/transactions/event/${id}`);
      setTransactions(res.data);
    }, [id]);

    useEffect(() => {
      loadTransactions();
    }, [loadTransactions]);

    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Transaksi Event</h1>
        {transactions.length === 0 ? (
          <p>No transactions</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((trx) => (
              <div key={trx.id} className="border p-4 rounded shadow">
                <p>
                  <strong>Status:</strong> {trx.status}
                </p>
                <p>
                  <strong>Qty:</strong> {trx.quantity}
                </p>
                <p>
                  <strong>Total:</strong> IDR {trx.totalPrice.toLocaleString()}
                </p>

                {trx.paymentProofUrl && (
                  <Image
                    src={trx.paymentProofUrl}
                    alt="proof"
                    width={200}
                    height={150}
                    className="mt-2"
                  />
                )}

                {trx.status === "waiting_payment" && (
                  <div className="mt-2">
                    <Link href={`/transactions/${trx.id}/upload`}>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded">
                        Upload Proof
                      </button>
                    </Link>
                  </div>
                )}

                {trx.status === "waiting_confirmation" && (
                  <p className="text-yellow-500 mt-2">
                    Waiting for confirmation...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    );
  }
