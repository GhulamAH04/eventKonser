// routes/transaction.route.ts

import { Router } from 'express';
import { createTransactionController, uploadPaymentProof } from '../controllers/transaction.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// ✅ Tambah route untuk membuat transaksi
router.post('/', createTransactionController);

// Route upload bukti pembayaran
router.put('/:transactionId/upload-proof', upload.single('proof'), uploadPaymentProof);

export default router;









/*
import { Router } from 'express';
import {
  postTransaction,
  uploadPaymentProof,
  handleTransactionConfirmation,
} from '../controllers/transaction.controller';
import { upload } from '../middlewares/upload.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, postTransaction);
router.put('/:id/upload-proof', upload.single('proof'), uploadPaymentProof);
router.put('/:id/confirm', verifyToken, handleTransactionConfirmation);

export default router;
*/