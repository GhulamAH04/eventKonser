"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const event_controller_2 = require("../controllers/event.controller");
const event_controller_3 = require("../controllers/event.controller");
// matikan middleware
/*
import { verifyToken } from '../middlewares/auth.middleware';
*/
const router = (0, express_1.Router)();
router.get('/', event_controller_1.getEvents);
router.get('/:id', event_controller_1.getEvent);
router.post('/', event_controller_1.postEvent);
router.get("/events/organizer", event_controller_2.getEventsByOrganizer);
router.put('/events/:id', event_controller_3.updateEvent);
exports.default = router;
