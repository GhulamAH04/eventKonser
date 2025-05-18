"use strict";
// backend/src/jobs/autoCancelTransactions.ts
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
exports.autoCancelTransactions = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const node_cron_1 = __importDefault(require("node-cron"));
// Auto-cancel transaksi jika 3 hari belum dikonfirmasi
const autoCancelTransactions = () => {
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 hari yang lalu
        const result = yield client_1.default.transaction.updateMany({
            where: {
                status: 'waiting_confirm',
                updated_at: { lt: threeDaysAgo },
            },
            data: {
                status: 'canceled', // Ubah status jadi canceled
            },
        });
        if (result.count > 0) {
            console.log(`[AUTO-CANCEL] ${result.count} transaksi dibatalkan otomatis.`);
        }
    }));
};
exports.autoCancelTransactions = autoCancelTransactions;
