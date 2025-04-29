// backend/src/services/transaction.service.ts

import prisma from '../../prisma/client';
import { validateVoucher } from './voucher.service'; // Import fungsi validasi voucher

export const createTransaction = async ({
  userId,
  eventId,
  quantity,
  voucherCode,
}: {
  userId: string;
  eventId: string;
  quantity: number;
  voucherCode?: string;  // Voucher bersifat opsional
}) => {
  // Validasi voucher jika ada
  let discountAmount = 0;

  if (voucherCode) {
    const voucher = await validateVoucher(voucherCode, eventId);
    discountAmount = voucher.discount_amount;  // Ambil diskon dari voucher
  }

  // Ambil harga event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) throw new Error('Event not found');

  // Hitung total harga setelah diskon
  const totalPrice = (event.price * quantity) - discountAmount;

  // Buat transaksi
  const transaction = await prisma.transaction.create({
    data: {
      user_id: userId,
      event_id: eventId,
      ticket_quantity: quantity,
      locked_price: event.price,
      total_price: totalPrice,
      status: 'waiting_payment',
      payment_proof: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return transaction;
};
