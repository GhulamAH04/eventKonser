import cron from 'node-cron';
import prisma from '../../prisma/client';

// Auto-cancel transaksi jika 3 hari belum dikonfirmasi
export const autoCancelTransactions = () => {
  cron.schedule('0 0 * * *', async () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const result = await prisma.transaction.updateMany({
      where: {
        status: 'waiting_confirm',
        updated_at: {
          lt: threeDaysAgo,
        },
      },
      data: {
        status: 'canceled',
      },
    });

    if (result.count > 0) {
      console.log(`[AUTO-CANCEL] ${result.count} transaksi dibatalkan otomatis.`);
    }
  });
};
