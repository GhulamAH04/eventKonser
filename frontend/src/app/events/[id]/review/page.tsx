"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from '@/lib/api';
import { toast } from "react-hot-toast";

export default function ReviewPage() {
  const { id } = useParams(); // id = eventId
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/reviews", {
        eventId: id,
        rating,
        comment,
      });
      toast.success("Review submitted!");
      router.push(`/events/${id}`);
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto min-h-screen flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="input"
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>
              {num} Star{num > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review"
          className="input"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </main>
  );
}
