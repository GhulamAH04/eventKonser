import api from "@/lib/api";

export interface ReviewPayload {
  rating: number;
  comment?: string;
  userId: string;
}

export async function submitReview(eventId: string, reviewData: ReviewPayload): Promise<void> {
  try {
    await api.post(`/api/reviews/${eventId}`, reviewData);
  } catch (error) {
    console.error('Failed to submit review', error);
    throw error;
  }
}
