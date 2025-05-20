// backend/src/controllers/event.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';

import {
  createEvent,
  getAllEvents as serviceGetAllEvents,
  getEventById,
} from '../services/event.service';

import { sendSuccess, sendError } from '../utils/responseHelper';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// ✅ GET all events (filter)
export const getEvents = async (req: Request, res: Response) => {
  try {
    const {
      search = '',
      category = '',
      location = '',
      sortBy = 'newest',
    } = req.query;

    const events = await serviceGetAllEvents(
      search as string,
      category as string,
      location as string,
      sortBy as 'newest' | 'soonest' | 'cheapest'
    );

    sendSuccess(res, 'Get all events successful', events);
  } catch (error) {
    console.error(error);
    sendError(res, 'Failed to get events', 500);
  }
};

// ✅ GET 1 event
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    if (!event) return sendError(res, 'Event not found', 404);
    sendSuccess(res, 'Get event detail successful', event);
  } catch (error) {
    console.error(error);
    sendError(res, 'Failed to get event detail', 500);
  }
};

// ✅ POST event
export const postEvent = async (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      location,
      price,
      startDate,
      endDate,
      description,
      promotion,
      organizer_id,
    } = req.body;

    if (!name || !category || !location || !startDate || !endDate) {
      return sendError(res, 'Missing required fields', 400);
    }

    const event = await createEvent({
      name,
      category,
      location,
      price,
      startDate,
      endDate,
      description,
      promotion,
      organizer_id,
      totalSeats: 100,
    });

    sendSuccess(res, 'Event created successfully', event, 201);
  } catch (error) {
    console.error('Error saat create event:', error);
    sendError(res, 'Failed to create event', 500);
  }
};

// ✅ PUT update event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      location,
      price,
      startDate,
      endDate,
      description,
    } = req.body;

    const updatedEvent = await prisma.event.update({
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

    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event:", error);
    return res.status(500).json({ message: "Failed to update event" });
  }
};

// ✅ GET events by organizer
export const getEventsByOrganizer = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const events = await prisma.event.findMany({
      where: { organizer_id: decoded.id },
      orderBy: { start_date: 'desc' },
    });

    return res.status(200).json(events); // ✅ pakai return agar tidak lanjut
  } catch (error) {
    console.error('Failed to get events by organizer:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
