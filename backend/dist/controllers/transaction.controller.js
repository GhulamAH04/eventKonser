"use strict";
// hapus middleware
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
exports.getTransactionsByEvent = exports.getTransactionById = exports.uploadPaymentProof = exports.createTransactionController = exports.updateTransactionStatus = exports.getTransactionsByOrganizer = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// Sesuaikan dengan prisma model
const client_2 = require("@prisma/client"); // Import enum dari Prisma
const responseHelper_1 = require("../utils/responseHelper");
const transaction_service_1 = require("../services/transaction.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
// GET /transactions/organizer
const getTransactionsByOrganizer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Ambil semua transaksi dari event yang dibuat oleh organizer ini
        const transactions = yield client_1.default.transaction.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
});
exports.getTransactionsByOrganizer = getTransactionsByOrganizer;
// update status transaksi
const updateTransactionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Cek validitas status
        if (!['done', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        // Ambil token
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: 'Unauthorized' });
        // Decode token untuk ambil id user
        const JWT_SECRET = process.env.JWT_SECRET || 'secret';
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Ambil transaksi termasuk data event-nya
        const transaction = yield client_1.default.transaction.findUnique({
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
        const updated = yield client_1.default.transaction.update({
            where: { id },
            data: {
                status,
                updated_at: new Date(),
            },
        });
        res.status(200).json({ message: 'Transaction status updated', transaction: updated });
    }
    catch (error) {
        console.error('Gagal update status transaksi:', error);
        res.status(500).json({ message: 'Failed to update transaction status' });
    }
});
exports.updateTransactionStatus = updateTransactionStatus;
// createTransactionController
const createTransactionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { event_id, ticket_quantity, voucher_code, guest_email, used_points, final_price } = req.body;
        // userId bisa null (guest checkout)
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        if (!event_id || !ticket_quantity) {
            return (0, responseHelper_1.sendError)(res, 'Missing required fields', 400);
        }
        const transaction = yield (0, transaction_service_1.createTransaction)({
            userId,
            eventId: event_id,
            quantity: ticket_quantity,
            voucherCode: voucher_code,
            guestEmail: guest_email || null,
            usedPoints: used_points,
            finalPrice: final_price,
        });
        (0, responseHelper_1.sendSuccess)(res, 'Transaction created', transaction, 201);
    }
    catch (error) {
        console.error(error);
        (0, responseHelper_1.sendError)(res, 'Failed to create transaction', 500);
    }
});
exports.createTransactionController = createTransactionController;
const uploadPaymentProof = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        const updated = yield client_1.default.transaction.update({
            where: { id },
            data: {
                payment_proof: fileUrl,
                status: client_2.TransactionStatus.done,
            },
        });
        yield client_1.default.event.update({
            where: { id: updated.event_id },
            data: {
                remaining_seats: { decrement: updated.ticket_quantity },
            },
        });
        res.status(200).json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.uploadPaymentProof = uploadPaymentProof;
const getTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const trx = yield client_1.default.transaction.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch transaction' });
    }
});
exports.getTransactionById = getTransactionById;
const getTransactionsByEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const transactions = yield client_1.default.transaction.findMany({
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
    }
    catch (error) {
        console.error('Failed to fetch transactions by event:', error);
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
});
exports.getTransactionsByEvent = getTransactionsByEvent;
