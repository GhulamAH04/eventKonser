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
exports.startTransactionExpireJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = __importDefault(require("../prisma/client"));
const startTransactionExpireJob = () => {
    node_cron_1.default.schedule("*/1 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(" Checking expired & stale transactions...");
        const now = new Date();
        //  Expire transaksi yang belum upload bukti setelah 2 jam
        const expired = yield client_1.default.transaction.updateMany({
            where: {
                status: "waiting_payment",
                created_at: {
                    lt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 jam lalu
                },
            },
            data: {
                status: "expired",
            },
        });
        if (expired.count > 0) {
            console.log(` ${expired.count} transactions expired after 2 hours`);
        }
        //  Cancel transaksi waiting_confirmation lebih dari 3 hari
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 hari lalu
        const toCancel = yield client_1.default.transaction.findMany({
            where: {
                status: "waiting_confirm",
                updated_at: {
                    lt: threeDaysAgo,
                },
            },
        });
        for (const trx of toCancel) {
            yield client_1.default.transaction.update({
                where: { id: trx.id },
                data: {
                    status: "canceled",
                },
            });
            //  Restore kursi event
            yield client_1.default.event.update({
                where: { id: trx.event_id },
                data: {
                    remaining_seats: {
                        increment: trx.ticket_quantity,
                    },
                },
            });
            console.log(` Auto-canceled: Transaction ${trx.id} (no confirm in 3 days)`);
        }
    }));
};
exports.startTransactionExpireJob = startTransactionExpireJob;
