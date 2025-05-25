// src/routes/review.routes.ts
import express from 'express';
import { postReview, getReviews, getReviewsForOrganizer } from '../controllers/review.controller';
// import { verifyToken } from '../middlewares/auth.middleware'; // Jangan digunakan untuk sementara

const router = express.Router();

// POST /reviews/:eventId - Untuk mengirimkan review ke event tertentu, memerlukan token
// router.post('/:eventId', verifyToken, postReview);  // Nonaktifkan/matikan middleware sementara

// GET /reviews/:eventId - Untuk mendapatkan semua review dari event tertentu
router.get('/:eventId', getReviews);

// GET /reviews/organizers/:id/reviews - Untuk mendapatkan semua review yang berhubungan dengan organizer tertentu
router.get('/organizers/:id/reviews', getReviewsForOrganizer);

export default router;
