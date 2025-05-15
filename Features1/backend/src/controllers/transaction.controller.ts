// hapus middleware

import { Request, Response } from 'express';
import prisma from '../../prisma/client';  // Sesuaikan dengan prisma model
import { TransactionStatus } from '@prisma/client'; // Import enum dari Prisma
import { sendSuccess, sendError } from '../utils/responseHelper';
import { createTransaction } from '../services/transaction.service';

export const createTransactionController = async (req: Request, res: Response) => {
  try {
    const { event_id, ticket_quantity, voucher_code, guest_email } = req.body;

    // userId bisa null (guest checkout)
    const userId = (req as any).user?.id || null;

    if (!event_id || !ticket_quantity) {
      return sendError(res, 'Missing required fields', 400);
    }

    const transaction = await createTransaction({
      userId,
      eventId: event_id,
      quantity: ticket_quantity,
      voucherCode: voucher_code,
      guestEmail: guest_email || null,
    });

    sendSuccess(res, 'Transaction created', transaction, 201);
  } catch (error) {
    console.error(error);
    sendError(res, 'Failed to create transaction', 500);
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
        payment_proof: fileUrl,
        status: TransactionStatus.done,
      },
    });

    await prisma.event.update({
      where: { id: updated.event_id },
      data: {
        remaining_seats: { decrement: updated.ticket_quantity },
      },
    });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


