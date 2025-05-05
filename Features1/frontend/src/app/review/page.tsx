"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [eventId, setEventId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/reviews", { eventId, rating, comment });
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      setEventId("");
    } catch {
      toast.error("Failed to submit review.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="input"
          required
        />
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-3xl cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input"
          rows={4}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    </main>
  );
}
