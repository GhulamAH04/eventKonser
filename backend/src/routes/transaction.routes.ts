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
