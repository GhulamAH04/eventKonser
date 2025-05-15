import { Request, Response } from 'express';
import {
  createEvent,
  getAllEvents as serviceGetAllEvents,
  getEventById,
} from '../services/event.service';
import { sendSuccess, sendError } from '../utils/responseHelper';

// GET all events with filter
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

// POST create new event
// event.controller.ts
export const postEvent = async (req: Request, res: Response) => {
  try {
    const { name, category, location, price, startDate, endDate, description, promotion } = req.body;

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
      totalSeats: 100,
    });

    sendSuccess(res, 'Event created successfully', event, 201);
  } catch (error: any) {
    console.error('🔥 Error saat create event:', error); // tambahkan log error
    sendError(res, 'Failed to create event', 500);
  }
};


// GET 1 event by ID
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);

    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    sendSuccess(res, 'Get event detail successful', event); // ✅ hanya 1x "data"
  } catch (error) {
    console.error(error);
    sendError(res, 'Failed to get event detail', 500);
  }
};