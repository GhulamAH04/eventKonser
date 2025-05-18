"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organizer_controller_1 = require("../controllers/organizer.controller"); //  ambil handler dari controller
const router = express_1.default.Router();
router.get('/:organizerId', organizer_controller_1.getOrganizerById); // handler dipanggil di sini
exports.default = router;
