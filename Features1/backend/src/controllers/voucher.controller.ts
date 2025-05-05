import { Request, Response } from "express";
import prisma from "../../prisma/client";  // Import Prisma Client

// Fungsi untuk membuat voucher
export const createVoucher = async (
  eventId: string,
  code: string,
  discountAmount: number,
  startDate: Date,
  endDate: Date,
  usageLimit: number
) => {
  try {
    const voucher = await prisma.voucher.create({
      data: {
        event_id: eventId,
        code: code,
        discount_amount: discountAmount,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        usage_limit: usageLimit,
        used_count: 0,  // Default count 0
      },
    });
    return voucher;  // Return the created voucher
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw new Error("Error creating voucher");
  }
};

// Fungsi untuk validasi voucher
export const validateVoucher = async (code: string, eventId: string) => {
  const voucher = await prisma.voucher.findUnique({
    where: { code },
    include: { event: true },
  });

  if (!voucher) {
    throw new Error('Voucher not found');
  }

  if (voucher.event_id !== eventId) {
    throw new Error('Voucher not valid for this event');
  }

  if (voucher.used_count >= voucher.usage_limit) {
    throw new Error('Voucher has reached the usage limit');
  }

  const currentDate = new Date();
  if (currentDate < new Date(voucher.start_date) || currentDate > new Date(voucher.end_date)) {
    throw new Error('Voucher has expired');
  }

  await prisma.voucher.update({
    where: { code },
    data: {
      used_count: { increment: 1 }, // Update used_count when voucher is used
    },
  });

  return voucher;  // Return the validated voucher
};
