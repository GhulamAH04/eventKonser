import express from 'express';
import prisma from '../../prisma/client';

const router = express.Router();

router.get('/:organizerId', async (req, res) => {
  try {
    const { organizerId } = req.params;

    const organizer = await prisma.user.findUnique({
      where: { id: organizerId },
      include: {
        Review: {
          include: { User: true, Event: true },
        },
      },
    });

    if (!organizer) return res.status(404).json({ message: 'Organizer not found' });

    const averageRating =
      organizer.Review.reduce((acc, review) => acc + review.rating, 0) /
        (organizer.Review.length || 1);

    res.json({
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
});

export default router;
