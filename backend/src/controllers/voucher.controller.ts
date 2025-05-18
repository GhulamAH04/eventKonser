import { Request, Response } from "express";
import prisma from "../prisma/client";  // Import Prisma Client

// Fungsi untuk membuat voucher baru
export const createVoucher = async (
  eventId: string,
  code: string,
  discountAmount: number,
  startDate: Date,
  endDate: Date,
  usageLimit: number
) => {
  try {
    // Simpan data voucher ke database
    const voucher = await prisma.voucher.create({
      data: {
        event_id: eventId,                   // ID event yang terkait
        code: code,                          // Kode unik voucher
        discount_amount: discountAmount,     // Potongan harga (misalnya Rp 5000)
        start_date: new Date(startDate),     // Tanggal mulai voucher aktif
        end_date: new Date(endDate),         // Tanggal voucher berakhir
        usage_limit: usageLimit,             // Berapa kali voucher bisa digunakan
        used_count: 0,                       // Awal pemakaian = 0
      },
    });
    return voucher;  // Kembalikan data voucher yang berhasil dibuat
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw new Error("Error creating voucher"); // Lempar error agar controller bisa tangani
  }
};

// Fungsi untuk mengecek apakah voucher valid dan bisa digunakan
export const validateVoucher = async (code: string, eventId: string) => {
  // Cari voucher berdasarkan kode unik
  const voucher = await prisma.voucher.findUnique({
    where: { code },
    include: { event: true }, // Optional: ambil juga data event-nya
  });

  // Kalau tidak ditemukan, error
  if (!voucher) {
    throw new Error('Voucher not found');
  }

  // Pastikan voucher digunakan untuk event yang sesuai
  if (voucher.event_id !== eventId) {
    throw new Error('Voucher not valid for this event');
  }

  // Cek apakah pemakaian voucher sudah mencapai batas maksimal
  if (voucher.used_count >= voucher.usage_limit) {
    throw new Error('Voucher has reached the usage limit');
  }

  // Cek tanggal apakah voucher masih aktif
  const currentDate = new Date();
  if (currentDate < new Date(voucher.start_date) || currentDate > new Date(voucher.end_date)) {
    throw new Error('Voucher has expired');
  }

  // Jika valid, update pemakaian voucher (+1)
  await prisma.voucher.update({
    where: { code },
    data: {
      used_count: { increment: 1 }, // Menambahkan 1 ke used_count
    },
  });

  return voucher;  // Kembalikan data voucher yang sudah divalidasi
};
