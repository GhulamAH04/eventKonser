import express from 'express';
import multer from 'multer';
import {
  createTransactionController,
  uploadPaymentProof
} from '../controllers/transaction.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', createTransactionController);

// ✅ route untuk upload bukti pembayaran
router.post('/:id/upload-proof', upload.single('payment_proof'), uploadPaymentProof);

export default router;
