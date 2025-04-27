import axios from "axios";

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  start_date: string;
  end_date: string;
}

export const fetchEvents = async (search?: string): Promise<Event[]> => {
  const res = await axios.get('/events', {
    params: { search }
  });
  return res.data.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const res = await axios.get(`/events/${id}`);
  return res.data.data;
};