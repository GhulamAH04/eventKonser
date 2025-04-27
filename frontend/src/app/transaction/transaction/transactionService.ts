import axios from "axios";

export const uploadPaymentProof = async (transactionId: string, formData: FormData) => {
  try {
    const res = await axios.post(`/transactions/${transactionId}/upload-payment-proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to upload payment proof:', error);
    throw error;
  }
};
