import { Request, Response } from 'express';
import { createEvent, getAllEvents, getEventById } from '../services/event.service'; // 🔥 sekalian import getEventById di atas

export const getEvents = async (req: Request, res: Response) => {
  const { search = '', location } = req.query;
  const events = await getAllEvents(search as string, location as string);
  return res.json(events);
};

export const postEvent = async (req: Request, res: Response) => {
  const { name, location, price, startDate, endDate, description, promotion } = req.body;

  if (!name || !location || !startDate || !endDate) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  // ✅ Panggil createEvent sekali saja
  const event = await createEvent({
    name,
    location,
    price,
    startDate,
    endDate,
    description,
    promotion, // 🔥 Pass promotion object
  });

  return res.status(201).json(event);
};

export const getEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await getEventById(id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  return res.json(event);
};
