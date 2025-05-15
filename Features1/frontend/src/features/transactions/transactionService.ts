import axios from "axios";
import { CreateTransactionInput, UserTransaction } from "@/interfaces/transaction";

export const createTransaction = async (input: CreateTransactionInput) => {
  try {
    const res = await axios.post("/transactions", input);
    return res.data;
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw error;
  }
};

export const getUserTransactions = async (): Promise<UserTransaction[]> => {
  const res = await axios.get('/transactions');
  return res.data.data;
};

export const getAllTransactions = async (): Promise<UserTransaction[]> => {
  const res = await axios.get('/admin/transactions');
  return res.data.data;
};

export const confirmTransaction = async (transactionId: string) => {
  await axios.patch(`/admin/transactions/${transactionId}/confirm`);
};

export const rejectTransaction = async (transactionId: string) => {
  await axios.patch(`/admin/transactions/${transactionId}/reject`);
};
