// src/controllers/review.controller.ts
import { Request, Response } from "express";
import prisma from "../prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Fungsi untuk submit review
export const postReview = async (req: Request, res: Response) => {
  // logika post review (sudah ada di kode sebelumnya)
};

// Fungsi untuk mengambil reviews berdasarkan eventId
export const getReviews = async (req: Request, res: Response) => {
  // logika get reviews berdasarkan eventId (sudah ada di kode sebelumnya)
};

// Fungsi untuk mendapatkan semua review untuk organizer
export const getReviewsForOrganizer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // organizerId

    // Ambil semua review untuk event yang dimiliki oleh organizer ini
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

export default {
  postReview,
  getReviews,
  getReviewsForOrganizer,
};
