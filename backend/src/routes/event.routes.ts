import { Router } from 'express';
import { postEvent, getEvents, getEvent } from '../controllers/event.controller';
import { getEventsByOrganizer } from '../controllers/event.controller';
import { updateEvent } from '../controllers/event.controller';

// matikan middleware
/*
import { verifyToken } from '../middlewares/auth.middleware';
*/

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', postEvent);
router.get("/events/organizer", getEventsByOrganizer);
router.put('/events/:id', updateEvent);

export default router;
