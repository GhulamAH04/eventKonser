import axios from "axios";

interface CreateTransactionInput {
  event_id: string;
  ticket_quantity: number;
}

export const createTransaction = async (input: CreateTransactionInput) => {
  try {
    const res = await axios.post("/transactions", input);
    return res.data;
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw error;
  }
};

export interface Transaction {
  id: string;
  eventName: string;
  userName?: string;
  ticket_quantity: number;
  total_price: number;
  status: string;
  payment_proof?: string;
}

export const getUserTransactions = async (): Promise<Transaction[]> => {
  const res = await axios.get('/transactions');
  return res.data.data;
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const res = await axios.get('/admin/transactions');
  return res.data.data;
};

export const confirmTransaction = async (transactionId: string) => {
  await axios.patch(`/admin/transactions/${transactionId}/confirm`);
};

export const rejectTransaction = async (transactionId: string) => {
  await axios.patch(`/admin/transactions/${transactionId}/reject`);
};
