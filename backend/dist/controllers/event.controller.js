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
exports.updateEvent = exports.getEvent = exports.postEvent = exports.getEvents = exports.getEventsByOrganizer = void 0;
// Import function dari service layer
const event_service_1 = require("../services/event.service");
// Import helper untuk kirim response sukses/error
const responseHelper_1 = require("../utils/responseHelper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const getEventsByOrganizer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Ambil token dari header
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        // Decode token untuk ambil organizer_id
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Cari event yang dimiliki oleh organizer tersebut
        const events = yield client_1.default.event.findMany({
            where: { organizer_id: decoded.id },
            orderBy: { start_date: "desc" },
        });
        res.status(200).json(events);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting events" });
    }
});
exports.getEventsByOrganizer = getEventsByOrganizer;
// GET all events (dengan filter query: search, category, location, sortBy)
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ambil query parameter dari URL, default ke string kosong jika tidak diisi
        const { search = '', category = '', location = '', sortBy = 'newest', } = req.query;
        // Panggil service untuk ambil semua event dengan filter tersebut
        const events = yield (0, event_service_1.getAllEvents)(search, category, location, sortBy // pastikan nilai sortBy sesuai enum yang diterima service
        );
        // Kirim response sukses dengan data events
        (0, responseHelper_1.sendSuccess)(res, 'Get all events successful', events);
    }
    catch (error) {
        console.error(error);
        (0, responseHelper_1.sendError)(res, 'Failed to get events', 500);
    }
});
exports.getEvents = getEvents;
// POST create new event
const postEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ambil data event dari request body
        const { name, category, location, price, startDate, endDate, description, organizer_id, promotion } = req.body;
        // Validasi: beberapa field wajib harus diisi
        if (!name || !category || !location || !startDate || !endDate) {
            return (0, responseHelper_1.sendError)(res, 'Missing required fields', 400);
        }
        // Panggil service untuk membuat event baru
        const event = yield (0, event_service_1.createEvent)({
            name,
            category,
            location,
            price,
            startDate,
            endDate,
            description,
            promotion,
            organizer_id,
            totalSeats: 100, // default seat di-hardcode
        });
        // Kirim response sukses
        (0, responseHelper_1.sendSuccess)(res, 'Event created successfully', event, 201);
    }
    catch (error) {
        console.error(' Error saat create event:', error); // Logging error ke console
        (0, responseHelper_1.sendError)(res, 'Failed to create event', 500);
    }
});
exports.postEvent = postEvent;
// GET 1 event by ID
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Ambil ID dari parameter URL
        // Ambil detail event dari service berdasarkan ID
        const event = yield (0, event_service_1.getEventById)(id);
        // Jika tidak ditemukan, kirim response 404
        if (!event) {
            return (0, responseHelper_1.sendError)(res, 'Event not found', 404);
        }
        // Kirim response sukses dengan 1 event
        (0, responseHelper_1.sendSuccess)(res, 'Get event detail successful', event);
    }
    catch (error) {
        console.error(error);
        (0, responseHelper_1.sendError)(res, 'Failed to get event detail', 500);
    }
});
exports.getEvent = getEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, category, location, price, startDate, endDate, description, } = req.body;
        const updatedEvent = yield client_1.default.event.update({
            where: { id },
            data: {
                name,
                category,
                location,
                price: Number(price),
                start_date: new Date(startDate),
                end_date: new Date(endDate),
                description,
            },
        });
        res.status(200).json(updatedEvent);
    }
    catch (error) {
        console.error("Failed to update event:", error);
        res.status(500).json({ message: "Failed to update event" });
    }
});
exports.updateEvent = updateEvent;
