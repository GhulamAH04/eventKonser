export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    email: string;
  };
}
