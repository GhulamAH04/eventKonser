"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voucher_controller_1 = require("../controllers/voucher.controller");
const router = express_1.default.Router();
// Membungkus createVoucher dengan middleware Express
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, code, discountAmount, startDate, endDate, usageLimit } = req.body;
        const voucher = yield (0, voucher_controller_1.createVoucher)(eventId, code, discountAmount, startDate, endDate, usageLimit);
        res.status(201).json(voucher); // Kembalikan data voucher yang berhasil dibuat
    }
    catch (error) {
        if (error instanceof Error) {
            // Menangani error yang merupakan instance dari Error
            res.status(500).json({ message: error.message });
        }
        else {
            // Menangani error lainnya (jika ada)
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
router.get("/validate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, eventId } = req.query;
        const voucher = yield (0, voucher_controller_1.validateVoucher)(code, eventId);
        res.status(200).json(voucher);
    }
    catch (error) {
        if (error instanceof Error) {
            // Menangani error yang merupakan instance dari Error
            res.status(500).json({ message: error.message });
        }
        else {
            // Menangani error lainnya (jika ada)
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
exports.default = router;
