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
exports.validateVoucher = exports.createVoucher = void 0;
const client_1 = __importDefault(require("../prisma/client")); // Import Prisma Client
// Fungsi untuk membuat voucher baru
const createVoucher = (eventId, code, discountAmount, startDate, endDate, usageLimit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Simpan data voucher ke database
        const voucher = yield client_1.default.voucher.create({
            data: {
                event_id: eventId, // ID event yang terkait
                code: code, // Kode unik voucher
                discount_amount: discountAmount, // Potongan harga (misalnya Rp 5000)
                start_date: new Date(startDate), // Tanggal mulai voucher aktif
                end_date: new Date(endDate), // Tanggal voucher berakhir
                usage_limit: usageLimit, // Berapa kali voucher bisa digunakan
                used_count: 0, // Awal pemakaian = 0
            },
        });
        return voucher; // Kembalikan data voucher yang berhasil dibuat
    }
    catch (error) {
        console.error("Error creating voucher:", error);
        throw new Error("Error creating voucher"); // Lempar error agar controller bisa tangani
    }
});
exports.createVoucher = createVoucher;
// Fungsi untuk mengecek apakah voucher valid dan bisa digunakan
const validateVoucher = (code, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    // Cari voucher berdasarkan kode unik
    const voucher = yield client_1.default.voucher.findUnique({
        where: { code },
        include: { event: true }, // Optional: ambil juga data event-nya
    });
    // Kalau tidak ditemukan, error
    if (!voucher) {
        throw new Error('Voucher not found');
    }
    // Pastikan voucher digunakan untuk event yang sesuai
    if (voucher.event_id !== eventId) {
        throw new Error('Voucher not valid for this event');
    }
    // Cek apakah pemakaian voucher sudah mencapai batas maksimal
    if (voucher.used_count >= voucher.usage_limit) {
        throw new Error('Voucher has reached the usage limit');
    }
    // Cek tanggal apakah voucher masih aktif
    const currentDate = new Date();
    if (currentDate < new Date(voucher.start_date) || currentDate > new Date(voucher.end_date)) {
        throw new Error('Voucher has expired');
    }
    // Jika valid, update pemakaian voucher (+1)
    yield client_1.default.voucher.update({
        where: { code },
        data: {
            used_count: { increment: 1 }, // Menambahkan 1 ke used_count
        },
    });
    return voucher; // Kembalikan data voucher yang sudah divalidasi
});
exports.validateVoucher = validateVoucher;
