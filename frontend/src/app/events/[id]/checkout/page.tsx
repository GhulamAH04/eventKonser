'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById, Event } from '@/features/events/eventService';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { createTransaction } from '@/features/transactions/transactionService';
export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Failed to fetch event for checkout:', error);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await createTransaction({
        event_id: id,
        ticket_quantity: quantity,
      });
      alert(`Berhasil membeli ${quantity} tiket untuk event ${event?.name}`);
      router.push('/');
    } catch (error) {
      console.error(error)
      alert('Gagal melakukan pembelian. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const totalPrice = event.price * quantity;

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar />

      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-8 mt-24 animate-fade-up">
        <h1 className="text-4xl md:text-5xl font-bold text-sky-700 text-center mb-6">
          Checkout Tiket
        </h1>

        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 transition hover:shadow-2xl">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{event.name}</h2>
            <p className="text-gray-600">{event.location}</p>
            <p className="text-gray-600">{new Date(event.start_date).toLocaleDateString()}</p>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="quantity" className="font-semibold text-gray-700">
              Jumlah Tiket
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div className="text-xl font-bold text-sky-700 text-center">
            Total: {event.price === 0 ? 'Gratis' : `Rp ${totalPrice.toLocaleString()}`}
          </div>

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition 
              ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Memproses...' : 'Konfirmasi Pembelian'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
