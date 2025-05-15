
import cron from "node-cron";
import prisma from "../../prisma/client";

export const startTransactionExpireJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("⏰ Checking expired & stale transactions...");

    const now = new Date();

    // 🔥 Expire transaksi yang belum upload bukti setelah 2 jam
    const expired = await prisma.transaction.updateMany({
      where: {
        status: "waiting_payment",
        created_at: {
          lt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 jam lalu
        },
      },
      data: {
        status: "expired",
      },
    });

    if (expired.count > 0) {
      console.log(`💀 ${expired.count} transactions expired after 2 hours`);
    }

    // 🔥 Cancel transaksi waiting_confirmation lebih dari 3 hari
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 hari lalu

    const toCancel = await prisma.transaction.findMany({
      where: {
        status: "waiting_confirm",
        updated_at: {
          lt: threeDaysAgo,
        },
      },
    });

    for (const trx of toCancel) {
      await prisma.transaction.update({
        where: { id: trx.id },
        data: {
          status: "canceled",
        },
      });

      // 🔥 Restore kursi event
      await prisma.event.update({
        where: { id: trx.event_id },
        data: {
          remaining_seats: {
            increment: trx.ticket_quantity,
          },
        },
      });

      console.log(`🚫 Auto-canceled: Transaction ${trx.id} (no confirm in 3 days)`);
    }
  });
};
