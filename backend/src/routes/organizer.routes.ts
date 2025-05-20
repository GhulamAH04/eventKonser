// src/routes/organizer.routes.ts

import express from 'express';
import { getOrganizerById } from '../controllers/organizer.controller'; //  ambil handler dari controller

const router = express.Router();

router.get('/:organizerId', getOrganizerById); // handler dipanggil di sini

export default router;
