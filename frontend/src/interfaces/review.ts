// Untuk mengirim review (POST)
export interface ReviewPayload {
  rating: number;
  comment: string;
  userId?: string;
}

// Untuk menerima review (GET)
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at?: string;
  userName?: string; // jika include User
}
