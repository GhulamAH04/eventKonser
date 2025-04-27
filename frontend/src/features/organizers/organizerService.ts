import axios from 'axios';

export interface OrganizerProfile {
  id: string;
  full_name: string;
  averageRating: number;
  reviews: {
    id: string;
    rating: number;
    comment?: string;
    userName: string;
  }[];
}

export async function fetchOrganizerProfile(organizerId: string): Promise<OrganizerProfile | null> {
  try {
    const response = await axios.get(`/api/organizers/${organizerId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch organizer profile', error);
    return null;
  }
}
