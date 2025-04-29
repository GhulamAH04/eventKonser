// voucher.controller.ts
import { Request, Response } from "express";
import prisma from "../../prisma/client";

// Create a new voucher
export const createVoucher = async (req: Request, res: Response) => {
  try {
    const { code, discountAmount, startDate, endDate, eventId, usageLimit = 100 } = req.body;  // Default value for usage_limit

    // Create a new voucher entry in the database
    const voucher = await prisma.voucher.create({
      data: {
        code,
        discount_amount: discountAmount,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        event_id: eventId,
        usage_limit: usageLimit,  // Make sure this is included in the data
      },
    });

    res.status(201).json(voucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating voucher" });
  }
};

// Validate voucher during checkout or usage
export const validateVoucher = async (req: Request, res: Response) => {
  try {
    const { code, eventId } = req.query;

    // Search voucher by code and eventId
    const voucher = await prisma.voucher.findFirst({
      where: {
        code: String(code),
        event_id: String(eventId),
        start_date: { lte: new Date() }, // Voucher must be valid from the start date
        end_date: { gte: new Date() },   // Voucher must be valid until the end date
      },
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher tidak ditemukan atau sudah expired." });
    }

    // Check if the voucher usage limit has been reached
    if (voucher.usage_limit <= voucher.used_count) {
      return res.status(400).json({ message: "Voucher usage limit reached." });
    }

    // Return the voucher if it's valid and usage limit has not been reached
    res.status(200).json(voucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error validating voucher" });
  }
};
