import express from 'express';
import multer from 'multer';
import {
  createTransactionController,
  uploadPaymentProof,
  getTransactionById, // ⬅️ pindahkan ke sini
} from '../controllers/transaction.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Buat transaksi (user atau guest)
router.post('/', createTransactionController);

// Upload bukti pembayaran
router.post('/:id/upload-proof', upload.single('payment_proof'), uploadPaymentProof);

// Get transaksi berdasarkan ID
router.get('/:id', getTransactionById); // ⬅️ pindahkan ke atas sebelum export

export default router;
