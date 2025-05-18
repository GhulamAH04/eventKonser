// backend/src/jobs/autoExpireTransactions.ts

import prisma from '../prisma/client';
 // Sesuaikan dengan prisma model
import { rollbackTransaction } from '../services/transaction.service';

// Set interval untuk cek setiap 1 jam
setInterval(async () => {
  const expiredTransactions = await prisma.transaction.findMany({
    where: {
      status: 'waiting_payment', // Pastikan transaksi dalam status waiting_payment
      created_at: { lt: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // 2 jam
    },
  });

  for (let transaction of expiredTransactions) {
    // Update status ke 'expired' setelah 2 jam
    await rollbackTransaction(transaction.id);

    // Rollback tiket yang digunakan
    await prisma.event.update({
      where: { id: transaction.event_id },
      data: { remaining_seats: { increment: transaction.ticket_quantity } },
    });
  }
}, 60 * 60 * 1000); // Cek setiap jam
