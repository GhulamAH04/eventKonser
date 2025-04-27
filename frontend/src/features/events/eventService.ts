import axios from 'axios';

export interface Event {
  id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  price: number;
  description?: string;
}

export async function fetchEvents(search?: string, category?: string): Promise<Event[]> {
  try {
    const response = await axios.get('/api/events', {
      params: {
        search,
        category,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
}
