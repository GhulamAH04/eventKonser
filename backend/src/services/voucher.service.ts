// backend/src/services/voucher.service.ts

import prisma from '../../prisma/client';

// Fungsi untuk memvalidasi voucher
export const validateVoucher = async (code: string, eventId: string) => {
  const voucher = await prisma.voucher.findUnique({
    where: { code },
    include: { event: true },
  });

  // Pastikan voucher ditemukan
  if (!voucher) {
    throw new Error('Voucher not found');
  }

  // Pastikan voucher masih berlaku untuk event ini
  if (voucher.event_id !== eventId) {
    throw new Error('Voucher not valid for this event');
  }

  // Cek apakah voucher sudah melebihi usage_limit
  if (voucher.used_count >= voucher.usage_limit) {
    throw new Error('Voucher has reached the usage limit');
  }

  // Pastikan voucher belum kedaluwarsa
  const currentDate = new Date();
  if (currentDate < new Date(voucher.start_date) || currentDate > new Date(voucher.end_date)) {
    throw new Error('Voucher has expired');
  }

  // Voucher valid, update used_count
  await prisma.voucher.update({
    where: { code },
    data: {
      used_count: { increment: 1 }, // Menambahkan 1 ke jumlah penggunaan
    },
  });

  return voucher;
};
