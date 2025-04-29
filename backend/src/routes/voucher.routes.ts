import express from "express";
import { createVoucher, validateVoucher } from "../controllers/voucher.controller";

const router = express.Router();

// Membungkus createVoucher dengan middleware Express
router.post("/", async (req, res) => {
  try {
    const { eventId, code, discountAmount, startDate, endDate, usageLimit } = req.body;
    const voucher = await createVoucher(eventId, code, discountAmount, startDate, endDate, usageLimit);
    res.status(201).json(voucher);  // Kembalikan data voucher yang berhasil dibuat
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Menangani error yang merupakan instance dari Error
      res.status(500).json({ message: error.message });
    } else {
      // Menangani error lainnya (jika ada)
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

router.get("/validate", async (req, res) => {
  try {
    const { code, eventId } = req.query;
    const voucher = await validateVoucher(code as string, eventId as string);
    res.status(200).json(voucher);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Menangani error yang merupakan instance dari Error
      res.status(500).json({ message: error.message });
    } else {
      // Menangani error lainnya (jika ada)
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
