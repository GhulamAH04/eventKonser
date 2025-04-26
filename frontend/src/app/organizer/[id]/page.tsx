"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Star } from "lucide-react";
import { Organizer } from "@/types/organizer";
import { Review } from "@/types/review";

export default function OrganizerProfilePage() {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [organizerRes, reviewsRes] = await Promise.all([
          api.get(`/organizers/${id}`),
          api.get(`/reviews/event/${id}`),
        ]);
        setOrganizer(organizerRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return <p className="text-center p-6">Loading organizer profile...</p>;
  }

  if (!organizer) {
    return <p className="text-center p-6">Organizer not found.</p>;
  }

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(
        1
      )
    : "N/A";

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Organizer Profile</h1>

      <div className="border p-4 rounded shadow mb-6">
        <h2 className="text-2xl font-bold">{organizer.full_name}</h2>
        <p className="text-gray-600">{organizer.email}</p>
        <p className="flex items-center gap-2 mt-2">
          <Star className="text-yellow-500" size={20} /> {avgRating} / 5
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-2">Reviews:</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border p-4 rounded shadow">
              <p className="font-semibold mb-1">{review.user.email}</p>
              <p className="flex items-center gap-2 mb-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="text-yellow-400" size={16} />
                ))}
              </p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
