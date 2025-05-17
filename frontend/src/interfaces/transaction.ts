// Digunakan saat POST /transactions
export interface CreateTransactionInput {
  event_id: string;
  ticket_quantity: number;
  guest_email?: string;
  user_id?: string;
  voucher_code?: string;
  used_points?: number;
  final_price?: number;
}

// Digunakan saat GET transaksi milik user (misalnya /me/transactions)
export interface UserTransaction {
  id: string;
  eventName: string;
  userName?: string;
  ticket_quantity: number;
  total_price: number;
  status: string;
  payment_proof?: string;
}

// Digunakan untuk halaman detail transaksi /transactions/:id
export interface TransactionDetail {
  id: string;
  status: string;
  ticket_quantity: number;
  total_price: number;
  payment_proof?: string;
  guestEmail?: string;
  Event: {
    name: string;
    location: string;
    startDate?: string;
  };
}

// Digunakan untuk GET semua transaksi dari 1 event
export interface EventTransaction {
  id: string;
  status: string;
  quantity: number;
  totalPrice: number;
  paymentProofUrl?: string;
}
