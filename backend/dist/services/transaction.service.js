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
exports.rollbackTransaction = exports.createTransaction = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const voucher_service_1 = require("./voucher.service");
const createTransaction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, eventId, quantity, voucherCode, guestEmail, usedPoints = 0, finalPrice, }) {
    let discountAmount = 0;
    if (voucherCode) {
        const voucher = yield (0, voucher_service_1.validateVoucher)(voucherCode, eventId);
        discountAmount = voucher.discount_amount;
    }
    const event = yield client_1.default.event.findUnique({
        where: { id: eventId },
    });
    if (!event)
        throw new Error('Event not found');
    const pricePerTicket = event.price;
    const expectedTotal = (pricePerTicket * quantity) - discountAmount - usedPoints;
    // Validasi final price
    if (finalPrice !== undefined && expectedTotal !== finalPrice) {
        throw new Error('Final price mismatch');
    }
    // Validasi dan kurangi poin jika user login
    if (userId && usedPoints > 0) {
        const userPoint = yield client_1.default.point.aggregate({
            where: {
                user_id: userId,
                expired_at: { gte: new Date() },
            },
            _sum: { amount: true },
        });
        const pointBalance = userPoint._sum.amount || 0;
        if (pointBalance < usedPoints)
            throw new Error('Not enough points');
        // Catat pemakaian poin (misal kamu pakai sistem log)
        yield client_1.default.point.create({
            data: {
                user_id: userId,
                amount: -usedPoints,
                source: 'redeem',
                expired_at: new Date(new Date().getFullYear() + 1, 0, 1),
            },
        });
    }
    const totalPrice = finalPrice !== null && finalPrice !== void 0 ? finalPrice : expectedTotal;
    const transaction = yield client_1.default.transaction.create({
        data: {
            user_id: userId || null,
            event_id: eventId,
            ticket_quantity: quantity,
            locked_price: pricePerTicket,
            total_price: totalPrice,
            status: 'waiting_payment',
            guestEmail: guestEmail || null,
            payment_proof: null,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });
    return transaction;
});
exports.createTransaction = createTransaction;
// rollback transaction 
const rollbackTransaction = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = yield tx.transaction.findUnique({
            where: { id: transactionId },
            select: {
                id: true,
                status: true,
                event_id: true,
                ticket_quantity: true,
                user_id: true,
                used_points: true,
                voucher_code: true,
                Event: {
                    select: {
                        id: true,
                    },
                },
                User: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!transaction)
            throw new Error("Transaction not found");
        // 1. Restore seat
        yield tx.event.update({
            where: { id: transaction.event_id },
            data: {
                remaining_seats: {
                    increment: transaction.ticket_quantity,
                },
            },
        });
        // 2. Restore voucher usage
        if (transaction.voucher_code) {
            yield tx.voucher.update({
                where: { code: transaction.voucher_code },
                data: {
                    used_count: {
                        decrement: 1,
                    },
                },
            });
        }
        // 3. Restore used points
        if (transaction.user_id && transaction.used_points && transaction.used_points > 0) {
            yield tx.point.create({
                data: {
                    user_id: transaction.user_id,
                    amount: transaction.used_points,
                    source: 'refund',
                    expired_at: new Date(new Date().getFullYear() + 1, 0, 1),
                },
            });
        }
        // 4. Update transaction status
        const updated = yield tx.transaction.update({
            where: { id: transactionId },
            data: {
                status: transaction.status === 'waiting_payment' ? 'expired' : 'canceled',
                updated_at: new Date(),
            },
        });
        return updated;
    }));
});
exports.rollbackTransaction = rollbackTransaction;
