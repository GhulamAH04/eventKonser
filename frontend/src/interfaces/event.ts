export interface Promotion {
  id: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  location: string;
  price: number;
  startDate: string;
  endDate?: string;
  promotion?: Promotion[];
  organizer_id: string;
  remaining_seats: number;
  image_url?: string;
}

export interface EventFormData {
  name: string;
  location: string;
  price: number;
  startDate: string;
  endDate?: string;
  description?: string;
  promotionCode?: string;
  promotionDiscount?: number;
  promotionStartDate?: string;
  promotionEndDate?: string;
  category: string;
}
