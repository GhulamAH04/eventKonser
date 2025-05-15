export interface RawVoucher {
  id: string;
  code: string;
  discount_amount: number;
  start_date: string;
  end_date: string;
}

export interface RawEvent {
  id: string;
  name: string;
  description?: string;
  location: string;
  price: number;
  start_date: string;
  end_date?: string;
  organizer_id: string;
  remaining_seats: number;
  Voucher?: RawVoucher[];
}
