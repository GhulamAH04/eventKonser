import express from 'express';
import prisma from '../../prisma/client';

const router = express.Router();

router.post('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rating, comment, userId } = req.body;

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        user_id: userId, // 🔥 Harus dikasih dari frontend
        event_id: eventId,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
});

export default router;
