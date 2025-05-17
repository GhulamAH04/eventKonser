import { Request, Response } from 'express';
import prisma from '../../prisma/client';

// Controller untuk ambil data organizer (user) berdasarkan ID
export const getOrganizerById = async (req: Request, res: Response) => {
  // Ambil parameter organizerId dari URL (/organizer/:organizerId)
  const { organizerId } = req.params;

  try {
    // Cari user berdasarkan ID dan ambil juga semua review-nya
    const organizer = await prisma.user.findUnique({
      where: { id: organizerId },
      include: {
        Review: {
          include: {
            User: true,  // reviewer (yang kasih review)
            Event: true, // event yang direview (meskipun tidak dipakai di response)
          },
        },
      },
    });

    // Kalau organizer tidak ditemukan, kirim error 404
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // Hitung rata-rata rating dari semua review
    const averageRating =
      organizer.Review.reduce((acc, review) => acc + review.rating, 0) /
      (organizer.Review.length || 1); // hindari divide by zero

    // Kirim response ke client dengan data lengkap organizer
    res.status(200).json({
      id: organizer.id,
      full_name: organizer.full_name,
      averageRating, // hasil perhitungan rating rata-rata
      reviews: organizer.Review.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        userName: r.User.full_name, // tampilkan nama user yang memberi review
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch organizer' });
  }
};
