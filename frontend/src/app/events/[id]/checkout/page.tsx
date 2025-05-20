'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getEventById } from '@/features/events/eventService';
import { createTransaction } from '@/features/transactions/transactionService';
import { validateVoucher } from '@/features/vouchers/voucherService';
import { Event } from '@/interfaces';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [guestEmail, setGuestEmail] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [search, setSearch] = useState('');
  const [pointsUsed, setPointsUsed] = useState(0);
  const [pointBalance, setPointBalance] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);


  // Fetch user data if logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string; role: string; points?: number }>(token);
        setUserId(decoded.id);
        setPointBalance(decoded.points || 0);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  }, []);

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

  useEffect(() => {
    if (event) {
      const total = Math.max(event.price * quantity - discountAmount, 0);
      setFinalPrice(total);
    }
  }, [event, quantity, discountAmount]);

  const handleApplyVoucher = async () => {
    if (!voucherCode || !id) return;

    try {
      setIsApplying(true);
      const voucher = await validateVoucher(voucherCode, id);
      setDiscountAmount(voucher.discount_amount);
      toast.success('Voucher berhasil digunakan!');
    } catch {
      toast.error('Voucher tidak valid atau sudah expired.');
      setDiscountAmount(0);
    } finally {
      setIsApplying(false);
    }
  };

  const handleConfirm = async () => {
    if (!event) return;

    if (!guestEmail) {
      toast.error('Mohon isi email Anda terlebih dahulu.');
      return;
    }

    if (event.remaining_seats && quantity > event.remaining_seats) {
      toast.error(`Jumlah tiket melebihi sisa kursi (${event.remaining_seats})`);
      return;
    }

    try {
      setIsLoading(true);
      await createTransaction({
        event_id: id,
        ticket_quantity: quantity,
        guest_email: guestEmail,
        used_points: pointsUsed,
        final_price: finalPrice,
        voucher_code: voucherCode,
      });


      toast.success(`Berhasil membeli ${quantity} tiket!`);
      router.push('/payment-success');
    } catch (error) {
      toast.error('Gagal membeli tiket. Silakan coba lagi.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar search={search} setSearch={setSearch} />

      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-8 mt-24 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-sky-700 text-center">Checkout Tiket</h1>

        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          {/* Event Info */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{event.name}</h2>
            <p className="text-gray-600">{event.location}</p>
            <p className="text-gray-600">{new Date(event.startDate).toLocaleDateString()}</p>
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Ticket Quantity */}
          <div className="flex flex-col gap-3">
            <label htmlFor="quantity" className="font-semibold text-gray-700">
              Jumlah Tiket
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1) setQuantity(val);
              }}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Voucher Section */}
          <div className="flex flex-col gap-3">
            <label htmlFor="voucher" className="font-semibold text-gray-700">
              Voucher Code
            </label>
            <input
              id="voucher"
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleApplyVoucher}
              disabled={isApplying}
              className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition mt-2 ${
                isApplying ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isApplying ? 'Mengecek...' : 'Apply Voucher'}
            </button>
          </div>

          {/* Final Price */}
          <div className="text-xl font-bold text-sky-700 text-center">
            Total: {event.price === 0 ? 'Gratis' : `Rp ${finalPrice.toLocaleString('id-ID')}`}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`mt-6 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Memproses...' : 'Konfirmasi Pembelian'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
