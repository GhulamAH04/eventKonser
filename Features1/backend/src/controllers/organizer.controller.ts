import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const getOrganizerById = async (req: Request, res: Response) => {
  const { organizerId } = req.params;

  try {
    const organizer = await prisma.user.findUnique({
      where: { id: organizerId },
      include: {
        Review: {
          include: { User: true, Event: true },
        },
      },
    });

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    const averageRating =
      organizer.Review.reduce((acc, review) => acc + review.rating, 0) /
      (organizer.Review.length || 1);

    res.status(200).json({
      id: organizer.id,
      full_name: organizer.full_name,
      averageRating,
      reviews: organizer.Review.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        userName: r.User.full_name,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch organizer' });
  }
};
