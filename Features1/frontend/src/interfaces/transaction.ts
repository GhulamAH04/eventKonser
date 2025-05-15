//  Interface untuk input transaksi (digunakan saat POST /transactions)
export interface CreateTransactionInput {
  event_id: string;
  ticket_quantity: number;
  guest_email?: string; // opsional untuk guest checkout
}

//  Interface untuk response transaksi milik user (dengan eventName dan userName)
export interface UserTransaction {
  id: string;
  eventName: string;
  userName?: string;
  ticket_quantity: number;
  total_price: number;
  status: string;
  payment_proof?: string;
}

//  Interface lain untuk transaksi detail 
export interface TransactionDetail {
  id: string;
  status: string;
  quantity: number;
  totalPrice: number;
  paymentProofUrl?: string;
  event: {
    name: string;
    location: string;
    startDate: string;
  };
}
