import prisma from '../../prisma/client';
import { validateVoucher } from './voucher.service';

interface CreateTransactionInput {
  userId?: string | null;
  eventId: string;
  quantity: number;
  voucherCode?: string;
  guestEmail?: string;
}

export const createTransaction = async ({
  userId,
  eventId,
  quantity,
  voucherCode,
  guestEmail,
}: CreateTransactionInput) => {
  // Validasi voucher jika ada
  let discountAmount = 0;

  if (voucherCode) {
    const voucher = await validateVoucher(voucherCode, eventId);
    discountAmount = voucher.discount_amount;
  }

  // Ambil data event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) throw new Error('Event not found');

  // Hitung total harga setelah diskon
  const totalPrice = (event.price * quantity) - discountAmount;

  // Buat transaksi
  const transaction = await prisma.transaction.create({
    data: {
      user_id: userId || null,
      event_id: eventId,
      ticket_quantity: quantity,
      locked_price: event.price,
      total_price: totalPrice,
      status: 'waiting_payment',
      guestEmail: guestEmail || null,
      payment_proof: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return transaction;
};
