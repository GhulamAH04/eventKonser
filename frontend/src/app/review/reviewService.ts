import api from "@/lib/api";

// Submit review dari user
export const submitReview = async (
  eventId: string,
  data: { rating: number; comment: string }
) => {
  return await api.post(`/reviews/${eventId}`, data);
};

// Ambil review untuk 1 event
export const getReviews = async (eventId: string) => {
  return await api.get(`/reviews/${eventId}`);
};

// Ambil semua review untuk organizer tertentu
export const getReviewsByOrganizer = async (organizerId: string) => {
  return await api.get(`/reviews/organizers/${organizerId}`);
};

// Ambil profil organizer (jika kamu ingin pakai endpoint gabungan profil + review)
export const getOrganizerProfile = async (organizerId: string) => {
  return await api.get(`/organizers/${organizerId}/profile`);
};

