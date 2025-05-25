import express from 'express';
import multer from 'multer';
import {
  createTransactionController,
  uploadPaymentProof,
  getTransactionById,
  getTransactionsByEvent,
  getTransactionsByUser
} from '../controllers/transaction.controller';

import { verifyTokenAndRole } from '../middlewares/auth.middleware';

import { getTransactionsByOrganizer } from '../controllers/transaction.controller';

import { updateTransactionStatus } from '../controllers/transaction.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Buat transaksi (user atau guest)
router.post('/', createTransactionController);

// Upload bukti pembayaran
router.post('/:id/upload-proof', upload.single('payment_proof'), uploadPaymentProof);

// Get transaksi berdasarkan ID
router.get('/:id', getTransactionById); // ⬅️ pindahkan ke atas sebelum export


router.patch('/transactions/:id/status', updateTransactionStatus);

router.get('/transactions/organizer', getTransactionsByOrganizer);

router.get('/transactions/event/:eventId', getTransactionsByEvent);

router.get('/user', getTransactionsByUser);

router.get('/transactions/user', verifyTokenAndRole('user'), getTransactionsByUser);

export default router;
