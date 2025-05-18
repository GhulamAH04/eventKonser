"use strict";
// backend/src/services/voucher.service.ts
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
exports.validateVoucher = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// Fungsi untuk memvalidasi voucher
const validateVoucher = (code, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const voucher = yield client_1.default.voucher.findUnique({
        where: { code },
        include: { event: true },
    });
    // Pastikan voucher ditemukan
    if (!voucher) {
        throw new Error('Voucher not found');
    }
    // Pastikan voucher masih berlaku untuk event ini
    if (voucher.event_id !== eventId) {
        throw new Error('Voucher not valid for this event');
    }
    // Cek apakah voucher sudah melebihi usage_limit
    if (voucher.used_count >= voucher.usage_limit) {
        throw new Error('Voucher has reached the usage limit');
    }
    // Pastikan voucher belum kedaluwarsa
    const currentDate = new Date();
    if (currentDate < new Date(voucher.start_date) || currentDate > new Date(voucher.end_date)) {
        throw new Error('Voucher has expired');
    }
    // Voucher valid, update used_count
    yield client_1.default.voucher.update({
        where: { code },
        data: {
            used_count: { increment: 1 }, // Menambahkan 1 ke jumlah penggunaan
        },
    });
    return voucher;
});
exports.validateVoucher = validateVoucher;
