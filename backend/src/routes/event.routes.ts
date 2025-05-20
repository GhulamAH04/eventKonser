// src/routes/event.routes.ts

import { Router } from 'express';
import {
  getEvents,
  getEvent,
  postEvent,
  updateEvent,
  getEventsByOrganizer,
} from '../controllers/event.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// ✅ PENTING: ini HARUS di atas `/:id`
router.get('/organizer', verifyToken, getEventsByOrganizer);

// route publik
router.get('/', getEvents);
router.get('/:id', getEvent);

// route protected
router.post('/', verifyToken, postEvent);
router.put('/:id', verifyToken, updateEvent);

export default router;
