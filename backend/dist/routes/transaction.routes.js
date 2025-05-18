"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const transaction_controller_1 = require("../controllers/transaction.controller");
const transaction_controller_2 = require("../controllers/transaction.controller");
const transaction_controller_3 = require("../controllers/transaction.controller");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Buat transaksi (user atau guest)
router.post('/', transaction_controller_1.createTransactionController);
// Upload bukti pembayaran
router.post('/:id/upload-proof', upload.single('payment_proof'), transaction_controller_1.uploadPaymentProof);
// Get transaksi berdasarkan ID
router.get('/:id', transaction_controller_1.getTransactionById); // ⬅️ pindahkan ke atas sebelum export
router.patch('/transactions/:id/status', transaction_controller_3.updateTransactionStatus);
router.get('/transactions/organizer', transaction_controller_2.getTransactionsByOrganizer);
router.get('/transactions/event/:eventId', transaction_controller_1.getTransactionsByEvent);
exports.default = router;
