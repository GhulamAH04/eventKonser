import { Request, Response } from 'express';
import { createTransaction } from '../services/transaction.service';
import prisma from '../../prisma/client';
import { confirmTransaction } from '../services/transaction.service';
import { AuthRequest } from '../middlewares/auth.middleware'; 
import cron from 'node-cron';

export const postTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, quantity } = req.body;

    const userId = req.user?.id || 'some-user-id'; // ❗ganti saat JWT siap

    if (!eventId || !quantity) {
      return res.status(400).json({ message: 'Missing eventId or quantity' });
    }

    const transaction = await createTransaction({
      userId,
      eventId,
      quantity,
    });

    return res.status(201).json(transaction);
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const uploadPaymentProof = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        payment_proof: fileUrl, // ✅ sesuaikan nama field di DB
        status: 'waiting_confirm', // ✅ sesuai enum di schema kamu
      },
    });

    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const handleTransactionConfirmation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const transaction = await confirmTransaction(id, action as 'accept' | 'reject');

    return res.status(200).json(transaction);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
