import express from 'express';
import multer from 'multer';
import {
  createTransactionController,
  uploadPaymentProof,
  getTransactionById,
  getTransactionsByEvent,
  getTransactionsByUser,
  getTransactionsByOrganizer,
  updateTransactionStatus
} from '../controllers/transaction.controller';

import { verifyToken, verifyTokenAndRole } from '../middlewares/auth.middleware';  // Updated import for auth middleware

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // File upload configuration

// Route untuk membuat transaksi (user atau guest)
router.post('/', createTransactionController);

// Route untuk upload bukti pembayaran
router.post('/:id/upload-proof', upload.single('payment_proof'), uploadPaymentProof);

// Route untuk mendapatkan transaksi berdasarkan ID
router.get('/:id', getTransactionById);  // Get transaction by ID (for viewing detailed info)

// Route untuk mengupdate status transaksi (hanya bisa diakses oleh organizer)
router.patch('/:id/status', verifyTokenAndRole('organizer'), updateTransactionStatus); // Ensure only 'organizer' can update

// Route untuk mendapatkan transaksi yang dimiliki organizer (hanya bisa diakses oleh organizer)
router.get('/organizer', verifyTokenAndRole('organizer'), getTransactionsByOrganizer);  // Get all transactions for an organizer

// Route untuk mendapatkan transaksi berdasarkan event
router.get('/event/:eventId', getTransactionsByEvent);  // Get all transactions for a specific event

// Route untuk mendapatkan transaksi user (sudah login)
router.get('/user', verifyToken, getTransactionsByUser); // Only accessible by authenticated users

// Route untuk mendapatkan transaksi milik user berdasarkan role (user only)
router.get('/transactions/user', verifyTokenAndRole('user'), getTransactionsByUser); // Ensure user can access only their own transactions

export default router;
