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
exports.getEventById = exports.createEvent = exports.getAllEvents = void 0;
const client_1 = require("@prisma/client");
const client_2 = __importDefault(require("../prisma/client"));
//  Ambil semua event dengan search, filter, dan sort
const getAllEvents = (search_1, category_1, location_1, ...args_1) => __awaiter(void 0, [search_1, category_1, location_1, ...args_1], void 0, function* (search, category, location, sortBy = 'newest') {
    const whereClause = {
        AND: [
            search
                ? {
                    name: {
                        contains: search,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                }
                : {},
            category
                ? {
                    category: {
                        equals: category,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                }
                : {},
            location
                ? {
                    location: {
                        contains: location,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                }
                : {},
        ],
    };
    const orderByClause = sortBy === 'soonest'
        ? { start_date: 'asc' }
        : sortBy === 'cheapest'
            ? { price: 'asc' }
            : { created_at: 'desc' };
    return client_2.default.event.findMany({
        where: whereClause,
        orderBy: orderByClause,
    });
});
exports.getAllEvents = getAllEvents;
//  Buat event baru + tambahkan promo jika ada
const createEvent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const event = yield client_2.default.event.create({
        data: {
            name: data.name,
            description: (_a = data.description) !== null && _a !== void 0 ? _a : '',
            category: data.category,
            location: data.location,
            price: data.price,
            start_date: new Date(data.startDate),
            end_date: new Date(data.endDate),
            total_seats: data.totalSeats,
            remaining_seats: data.totalSeats,
            organizer_id: 'org-1',
        },
    });
    if (data.promotion) {
        yield client_2.default.voucher.create({
            data: {
                event_id: event.id,
                code: data.promotion.code,
                discount_amount: data.promotion.discount,
                start_date: new Date(data.promotion.startDate),
                end_date: new Date(data.promotion.endDate),
                usage_limit: 1,
                used_count: 0,
            },
        });
    }
    return event;
});
exports.createEvent = createEvent;
//  Ambil 1 event berdasarkan ID (dengan voucher jika ada)
const getEventById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return client_2.default.event.findUnique({
        where: { id },
        include: {
            Voucher: true,
        },
    });
});
exports.getEventById = getEventById;
