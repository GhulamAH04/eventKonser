'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { submitReview } from '@/app/review/reviewService'; // pastikan path ini sesuai
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function SubmitReviewPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reviewId) return;
    setIsSubmitting(true);
    try {
      await submitReview(reviewId, { rating, comment });
      alert('Review submitted successfully!');
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar search="" setSearch={() => {}} />
      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-8 mt-24">
        <h1 className="text-3xl font-bold text-sky-700 text-center">Submit Review</h1>

        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-gray-600 font-semibold">Rating (1-5)</span>
            <input
              type="number"
              value={rating}
              min={1}
              max={5}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-gray-600 font-semibold">Comment (optional)</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
              rows={4}
            />
          </label>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
