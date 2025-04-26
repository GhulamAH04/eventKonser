import prisma from '../../prisma/client';



export const createTransaction = async (data: {
  userId: string;
  eventId: string;
  quantity: number;
}) => {
  const event = await prisma.event.findUnique({
    where: { id: data.eventId },
  });

  if (!event) throw new Error('Event not found');

  const totalPrice = event.price * data.quantity;
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 jam dari sekarang

  return await prisma.transaction.create({
    data: {
      userId: data.userId,
      eventId: data.eventId,
      quantity: data.quantity,
      totalPrice,
      status: 'waiting_payment',
      expiresAt,
    },
  });
};

export const confirmTransaction = async (id: string, action: 'accept' | 'reject') => {
  const status = action === 'accept' ? 'done' : 'rejected';

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) throw new Error('Transaction not found');

  const updated = await prisma.transaction.update({
    where: { id },
    data: { status },
  });

  if (status === 'rejected') {
    await prisma.event.update({
      where: { id: transaction.eventId },
      data: {
        availableSeats: {
          increment: transaction.quantity,
        },
      },
    });

    // TODO: kembalikan voucher/point kalau dipakai
  }

  return updated;
};