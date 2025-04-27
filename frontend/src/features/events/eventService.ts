import axios from 'axios';

export interface Event {
  id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  price: number;
  description?: string;
  organizer_id: string;
}

export async function fetchEvents(search?: string, category?: string, location?: string): Promise<Event[]> {
  try {
    const response = await axios.get('/api/events', {
      params: { search, category, location },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
}

export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const response = await axios.get(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch event by id', error);
    return null;
  }
}
