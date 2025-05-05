import { Router } from 'express';
import { registerController } from '../controllers/auth.controller';

const router = Router();

// Register endpoint
router.post('/register', registerController);

// Tambahan login akan dibuat nanti di step berikutnya
// router.post('/login', login);

export default router;
