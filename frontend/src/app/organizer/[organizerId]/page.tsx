'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/NavBar';
import { OrganizerProfile } from '@/interfaces/organizerProfile';
import Footer from '@/components/Footer';
import { getOrganizerProfile } from '@/app/review/reviewService';

export default function OrganizerProfilePage() {
  const params = useParams();
  const organizerId = params.organizerId as string;
  const [organizer, setOrganizer] = useState<OrganizerProfile | null>(null);

  useEffect(() => {
    async function loadOrganizer() {
      const res = await getOrganizerProfile(organizerId); // ✅ Panggil fungsi baru
      setOrganizer(res.data);
    }

    if (organizerId) {
      loadOrganizer();
    }
  }, [organizerId]);

  if (!organizer) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading organizer...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar search="" setSearch={() => {}} />

      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-10 mt-24 animate-fade-in">
        {/* Organizer Name */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700 text-center">
          {organizer.full_name}
        </h1>

        {/* Average Rating */}
        <p className="text-lg text-gray-600">
          ⭐ Average Rating:{' '}
          {organizer.averageRating !== undefined ? organizer.averageRating.toFixed(1) : 'N/A'}
        </p>

        {/* Reviews */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
          {organizer.reviews.length === 0 ? (
            <p className="text-center text-gray-500">No reviews yet.</p>
          ) : (
            organizer.reviews.map((review) => (
              <div key={review.id} className="border-b py-4">
                <p className="font-semibold">{review.userName}</p>
                <p className="text-sky-600">⭐ {review.rating}</p>
                <p className="text-gray-700">{review.comment || '-'}</p>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
