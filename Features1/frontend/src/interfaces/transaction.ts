export type Transaction = {
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
};

