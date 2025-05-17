import { Request, Response } from 'express';

// Import function dari service layer
import {
  createEvent,
  getAllEvents as serviceGetAllEvents,
  getEventById,
} from '../services/event.service';

// Import helper untuk kirim response sukses/error
import { sendSuccess, sendError } from '../utils/responseHelper';


// GET all events (dengan filter query: search, category, location, sortBy)
export const getEvents = async (req: Request, res: Response) => {
  try {
    // Ambil query parameter dari URL, default ke string kosong jika tidak diisi
    const {
      search = '',
      category = '',
      location = '',
      sortBy = 'newest',
    } = req.query;

    // Panggil service untuk ambil semua event dengan filter tersebut
    const events = await serviceGetAllEvents(
      search as string,
      category as string,
      location as string,
      sortBy as 'newest' | 'soonest' | 'cheapest' // pastikan nilai sortBy sesuai enum yang diterima service
    );

    // Kirim response sukses dengan data events
    sendSuccess(res, 'Get all events successful', events);
  } catch (error) {
    console.error(error);
    sendError(res, 'Failed to get events', 500);
  }
};


// POST create new event
export const postEvent = async (req: Request, res: Response) => {
  try {
    // Ambil data event dari request body
    const {
      name,
      category,
      location,
      price,
      startDate,
      endDate,
      description,
      promotion
    } = req.body;

    // Validasi: beberapa field wajib harus diisi
    if (!name || !category || !location || !startDate || !endDate) {
      return sendError(res, 'Missing required fields', 400);
    }

    // Panggil service untuk membuat event baru
    const event = await createEvent({
      name,
      category,
      location,
      price,
      startDate,
      endDate,
      description,
      promotion,
      totalSeats: 100, // default seat di-hardcode
    });

    // Kirim response sukses
    sendSuccess(res, 'Event created successfully', event, 201);
  } catch (error: any) {
    console.error(' Error saat create event:', error); // Logging error ke console
    sendError(res, 'Failed to create event', 500);
  }
};


// GET 1 event by ID
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Ambil ID dari parameter URL

    // Ambil detail event dari service berdasarkan ID
    const event = await getEventById(id);

    // Jika tidak ditemukan, kirim response 404
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Kirim response sukses dengan 1 event
    sendSuccess(res, 'Get event detail successful', event);
  } catch (error) {
    console.error(error);
    sendError(res, 'Failed to get event detail', 500);
  }
};
