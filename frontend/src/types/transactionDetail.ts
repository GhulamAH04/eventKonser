export interface Transaction {
  id: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  status: string;
  paymentProofUrl?: string;
}
