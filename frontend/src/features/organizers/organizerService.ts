import axios from '@/lib/axios'
import { OrganizerProfile } from '@/interfaces/organizerProfile';

// fungsi utama untuk ambil data organizer + review
export async function fetchOrganizerProfile(organizerId: string): Promise<OrganizerProfile | null> {
  try {
    const response = await axios.get(`/organizers/${organizerId}`);
    console.log('📡 API Response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Failed to fetch organizer profile', error);
    return null;    // fallback biar tidak crash di frontend
  }
}

  