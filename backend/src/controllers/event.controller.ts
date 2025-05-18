import { Request, Response } from 'express';

// Import function dari service layer
import {
  createEvent,
  getAllEvents as serviceGetAllEvents,
  getEventById,
} from '../services/event.service';

// Import helper untuk kirim response sukses/error
import { sendSuccess, sendError } from '../utils/responseHelper';
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client';


const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const getEventsByOrganizer = async (req: Request, res: Response) => {
  try {
    // Ambil token dari header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Decode token untuk ambil organizer_id
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Cari event yang dimiliki oleh organizer tersebut
    const events = await prisma.event.findMany({
      where: { organizer_id: decoded.id },
      orderBy: { start_date: "desc" },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting events" });
  }
};

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
      organizer_id,
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
      organizer_id,
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

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
};
