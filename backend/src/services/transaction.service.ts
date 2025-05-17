import prisma from '../../prisma/client';
import { validateVoucher } from './voucher.service';

interface CreateTransactionInput {
  userId?: string | null;
  eventId: string;
  quantity: number;
  voucherCode?: string;
  guestEmail?: string;
  usedPoints?: number;
  finalPrice?: number;
}

export const createTransaction = async ({
  userId,
  eventId,
  quantity,
  voucherCode,
  guestEmail,
  usedPoints = 0,
  finalPrice,
}: CreateTransactionInput) => {
  let discountAmount = 0;

  if (voucherCode) {
    const voucher = await validateVoucher(voucherCode, eventId);
    discountAmount = voucher.discount_amount;
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) throw new Error('Event not found');

  const pricePerTicket = event.price;
  const expectedTotal = (pricePerTicket * quantity) - discountAmount - usedPoints;

  // Validasi final price
  if (finalPrice !== undefined && expectedTotal !== finalPrice) {
    throw new Error('Final price mismatch');
  }

  // Validasi dan kurangi poin jika user login
  if (userId && usedPoints > 0) {
    const userPoint = await prisma.point.aggregate({
      where: {
        user_id: userId,
        expired_at: { gte: new Date() },
      },
      _sum: { amount: true },
    });

    const pointBalance = userPoint._sum.amount || 0;
    if (pointBalance < usedPoints) throw new Error('Not enough points');

    // Catat pemakaian poin (misal kamu pakai sistem log)
    await prisma.point.create({
      data: {
        user_id: userId,
        amount: -usedPoints,
        source: 'redeem',
        expired_at: new Date(new Date().getFullYear() + 1, 0, 1),
      },
    });
  }

  const totalPrice = finalPrice ?? expectedTotal;

  const transaction = await prisma.transaction.create({
    data: {
      user_id: userId || null,
      event_id: eventId,
      ticket_quantity: quantity,
      locked_price: pricePerTicket,
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


// rollback transaction 
export const rollbackTransaction = async (transactionId: string) => {
  return await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({
      where: { id: transactionId },
      select: {
        id: true,
        status: true,
        event_id: true,
        ticket_quantity: true,
        user_id: true,
        used_points: true,
        voucher_code: true,
        Event: {
          select: {
            id: true,
          },
        },
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!transaction) throw new Error("Transaction not found");

    // 1. Restore seat
    await tx.event.update({
      where: { id: transaction.event_id },
      data: {
        remaining_seats: {
          increment: transaction.ticket_quantity,
        },
      },
    });

    // 2. Restore voucher usage
    if (transaction.voucher_code) {
      await tx.voucher.update({
        where: { code: transaction.voucher_code },
        data: {
          used_count: {
            decrement: 1,
          },
        },
      });
    }

    // 3. Restore used points
    if (transaction.user_id && transaction.used_points && transaction.used_points > 0) {
      await tx.point.create({
        data: {
          user_id: transaction.user_id,
          amount: transaction.used_points,
          source: 'refund',
          expired_at: new Date(new Date().getFullYear() + 1, 0, 1),
        },
      });
    }

    // 4. Update transaction status
    const updated = await tx.transaction.update({
      where: { id: transactionId },
      data: {
        status: transaction.status === 'waiting_payment' ? 'expired' : 'canceled',
        updated_at: new Date(),
      },
    });

    return updated;
  });
};

