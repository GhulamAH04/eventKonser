import { Request, Response } from "express";
import prisma from "../../prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const postReview = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { rating, comment } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = decoded.id;

    //  Validasi: hanya user dengan transaksi 'done' untuk event ini yang boleh review
    const hasDoneTransaction = await prisma.transaction.findFirst({
      where: {
        user_id: userId,
        event_id: eventId,
        status: 'done',
      },
    });

    if (!hasDoneTransaction) {
      return res.status(403).json({ message: "You can only review events you've attended." });
    }

    // ✅ Cek apakah user sudah review event ini sebelumnya
    const existingReview = await prisma.review.findFirst({
      where: {
        user_id: userId,
        event_id: eventId,
      },
    });

    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this event." });
    }

    const review = await prisma.review.create({
      data: {
        event_id: eventId,
        user_id: userId,
        rating,
        comment,
      },
    });

    res.status(201).json(review);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { event_id: eventId },
      include: {
        User: { select: { email: true } },
      },
    });

    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// review untuk organizer
export const getReviewsForOrganizer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // organizerId

    // Ambil semua review untuk event milik organizer ini
    const reviews = await prisma.review.findMany({
      where: {
        Event: {
          organizer_id: id,
        },
      },
      include: {
        Event: {
          select: {
            name: true,
          },
        },
        User: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json(reviews);
  } catch (error) {
    console.error('Failed to get organizer reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};
