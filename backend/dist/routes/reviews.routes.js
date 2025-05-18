"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controllers/review.controller");
const review_controller_2 = require("../controllers/review.controller");
const organizer_controller_1 = require("../controllers/organizer.controller");
const router = express_1.default.Router();
router.post('/:eventId', review_controller_1.postReview);
router.get('/:eventId', review_controller_1.getReviews);
router.get('/organizers/:id/reviews', review_controller_2.getReviewsForOrganizer);
router.get('/organizers/:id/profile', organizer_controller_1.getOrganizerProfileWithReviews);
exports.default = router;
