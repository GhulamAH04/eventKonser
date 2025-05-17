import { Router } from 'express';
import { postEvent, getEvents, getEvent } from '../controllers/event.controller';

// matikan middleware
/*
import { verifyToken } from '../middlewares/auth.middleware';
*/

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', postEvent);

export default router;
