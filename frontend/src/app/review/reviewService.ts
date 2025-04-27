import axios from 'axios';

export async function submitReview(eventId: string, rating: number, comment: string): Promise<void> {
  try {
    await axios.post(`/api/reviews/${eventId}`, {
      rating,
      comment,
    });
  } catch (error) {
    console.error('Failed to submit review', error);
    throw error;
  }
}
