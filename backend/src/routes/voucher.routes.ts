import express from "express";
import { createVoucher, validateVoucher } from "../controllers/voucher.controller";

const router = express.Router();

router.post("/", createVoucher);
router.get("/validate", validateVoucher);

export default router;
