import api from "@/lib/axios";

export const validateVoucher = async (code: string, eventId: string) => {
  const response = await api.get(`/vouchers/validate?code=${code}&eventId=${eventId}`);
  return response.data.data;
};
