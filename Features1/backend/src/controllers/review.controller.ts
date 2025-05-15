//hapus middleware karena ga ada features 2
// review.controller.ts

import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

export const postReview = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        user_id: userId,         // GANTI dari userId
        event_id: eventId,       // GANTI dari eventId
      },
    });

    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this event." });
    }

    const review = await prisma.review.create({
      data: {
        event_id: eventId,       //  GANTI dari eventId
        user_id: userId,         //  GANTI dari userId
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
      where: {
        event_id: String(eventId), //  sesuaikan nama field
      },
      include: {
        User: {
          select: { email: true },
        },
      },
    });

    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
