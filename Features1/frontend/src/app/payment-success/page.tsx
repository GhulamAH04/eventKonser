'use client';

import Link from 'next/link';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar search="" setSearch={() => {}} />

      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 gap-6 mt-24 text-center">
        <h1 className="text-4xl font-bold text-sky-700">Pembayaran Berhasil!</h1>
        <p className="text-gray-600 text-lg max-w-md">
          Terima kasih sudah mengupload bukti pembayaran. Tim kami akan segera memverifikasi
          pembayaran Anda.
        </p>
        <Link
          href="/"
          className="mt-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Kembali ke Home
        </Link>
      </main>

      <Footer />
    </div>
  );
}
