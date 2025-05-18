"use strict";
// backend/src/jobs/autoExpireTransactions.ts
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
const client_1 = __importDefault(require("../prisma/client"));
// Sesuaikan dengan prisma model
const transaction_service_1 = require("../services/transaction.service");
// Set interval untuk cek setiap 1 jam
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const expiredTransactions = yield client_1.default.transaction.findMany({
        where: {
            status: 'waiting_payment', // Pastikan transaksi dalam status waiting_payment
            created_at: { lt: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // 2 jam
        },
    });
    for (let transaction of expiredTransactions) {
        // Update status ke 'expired' setelah 2 jam
        yield (0, transaction_service_1.rollbackTransaction)(transaction.id);
        // Rollback tiket yang digunakan
        yield client_1.default.event.update({
            where: { id: transaction.event_id },
            data: { remaining_seats: { increment: transaction.ticket_quantity } },
        });
    }
}), 60 * 60 * 1000); // Cek setiap jam
