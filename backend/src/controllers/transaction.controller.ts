// hapus middleware

import { Request, Response } from 'express';
import prisma from '../../prisma/client';  // Sesuaikan dengan prisma model
import { TransactionStatus } from '@prisma/client'; // Import enum dari Prisma
import { sendSuccess, sendError } from '../utils/responseHelper';
import { createTransaction } from '../services/transaction.service';
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// GET /transactions/organizer
export const getTransactionsByOrganizer = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Ambil semua transaksi dari event yang dibuat oleh organizer ini
    const transactions = await prisma.transaction.findMany({
      where: {
        Event: {
          organizer_id: decoded.id,
        },
      },
      include: {
        Event: true,
        User: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

// update status transaksi
export const updateTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Cek validitas status
    if (!['done', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Ambil token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Decode token untuk ambil id user
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Ambil transaksi termasuk data event-nya
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        Event: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Validasi: hanya organizer dari event ini yang boleh update
    if (transaction.Event.organizer_id !== decoded.id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this event' });
    }

    // Update status transaksi
    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        status,
        updated_at: new Date(),
      },
    });

    res.status(200).json({ message: 'Transaction status updated', transaction: updated });
  } catch (error) {
    console.error('Gagal update status transaksi:', error);
    res.status(500).json({ message: 'Failed to update transaction status' });
  }
};

// createTransactionController

export const createTransactionController = async (req: Request, res: Response) => {
  try {
const { event_id, ticket_quantity, voucher_code, guest_email, used_points, final_price } = req.body;


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
  usedPoints: used_points,
  finalPrice: final_price,
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
export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const trx = await prisma.transaction.findUnique({
      where: { id },
      include: {
        Event: true,
      },
    });

    if (!trx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      id: trx.id,
      status: trx.status,
      quantity: trx.ticket_quantity,
      totalPrice: trx.total_price,
      paymentProofUrl: trx.payment_proof || null,
      event: {
        name: trx.Event.name,
        location: trx.Event.location,
        startDate: trx.Event.start_date,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch transaction' });
  }
};


export const getTransactionsByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const transactions = await prisma.transaction.findMany({
      where: { event_id: eventId },
      select: {
        id: true,
        status: true,
        ticket_quantity: true,
        total_price: true,
        payment_proof: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Ubah format jika ingin field lebih rapi
    const result = transactions.map((trx) => ({
      id: trx.id,
      status: trx.status,
      quantity: trx.ticket_quantity,
      totalPrice: trx.total_price,
      paymentProofUrl: trx.payment_proof,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch transactions by event:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};
