import express from 'express';
import { postReview, getReviews } from '../controllers/review.controller';
import { getReviewsForOrganizer } from '../controllers/review.controller';
import { getOrganizerProfileWithReviews } from '../controllers/organizer.controller';

const router = express.Router();

router.post('/:eventId', postReview);
router.get('/:eventId', getReviews);
router.get('/organizers/:id/reviews', getReviewsForOrganizer);
router.get('/organizers/:id/profile', getOrganizerProfileWithReviews);

export default router;
