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
exports.getReviewsForOrganizer = exports.getReviews = exports.postReview = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const postReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { eventId } = req.params;
        const { rating, comment } = req.body;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = decoded.id;
        //  Validasi: hanya user dengan transaksi 'done' untuk event ini yang boleh review
        const hasDoneTransaction = yield client_1.default.transaction.findFirst({
            where: {
                user_id: userId,
                event_id: eventId,
                status: 'done',
            },
        });
        if (!hasDoneTransaction) {
            return res.status(403).json({ message: "You can only review events you've attended." });
        }
        // ✅ Cek apakah user sudah review event ini sebelumnya
        const existingReview = yield client_1.default.review.findFirst({
            where: {
                user_id: userId,
                event_id: eventId,
            },
        });
        if (existingReview) {
            return res.status(400).json({ message: "You already reviewed this event." });
        }
        const review = yield client_1.default.review.create({
            data: {
                event_id: eventId,
                user_id: userId,
                rating,
                comment,
            },
        });
        res.status(201).json(review);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.postReview = postReview;
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const reviews = yield client_1.default.review.findMany({
            where: { event_id: eventId },
            include: {
                User: { select: { email: true } },
            },
        });
        res.json(reviews);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getReviews = getReviews;
// review untuk organizer
const getReviewsForOrganizer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // organizerId
        // Ambil semua review untuk event milik organizer ini
        const reviews = yield client_1.default.review.findMany({
            where: {
                Event: {
                    organizer_id: id,
                },
            },
            include: {
                Event: {
                    select: {
                        name: true,
                    },
                },
                User: {
                    select: {
                        email: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        res.json(reviews);
    }
    catch (error) {
        console.error('Failed to get organizer reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});
exports.getReviewsForOrganizer = getReviewsForOrganizer;
