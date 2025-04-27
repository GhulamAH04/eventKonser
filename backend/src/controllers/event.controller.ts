import { Request, Response } from 'express';
import { createEvent, getAllEvents as serviceGetAllEvents, getEventById } from '../services/event.service';
import { sendSuccess, sendError } from "../utils/responseHelper";

// Untuk GET semua event, dengan optional search dan location
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { search = '', location = '' } = req.query;
    const events = await serviceGetAllEvents(search as string, location as string);
    sendSuccess(res, "Get all events successful", events);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to get events", 500);
  }
};

// Untuk POST membuat event baru
export const postEvent = async (req: Request, res: Response) => {
  try {
    const { name, location, price, startDate, endDate, description, promotion } = req.body;

    if (!name || !location || !startDate || !endDate) {
      return sendError(res, "Missing required fields", 400);
    }

    const event = await createEvent({
      name,
      location,
      price,
      startDate,
      endDate,
      description,
      promotion, 
    });

    sendSuccess(res, "Event created successfully", event, 201);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to create event", 500);
  }
};

// Untuk GET 1 event by ID
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    
    if (!event) {
      return sendError(res, "Event not found", 404);
    }

    sendSuccess(res, "Get event detail successful", event);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to get event detail", 500);
  }
};
