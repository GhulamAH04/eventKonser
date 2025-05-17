export interface OrganizerProfile {
  id: string;
  full_name: string;
  averageRating?: number;
  reviews: {
    id: string;
    rating: number;
    comment?: string;
    userName: string;
  }[];
}

