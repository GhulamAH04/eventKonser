'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Event } from '@/interfaces/event';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';
import { User } from '@/interfaces';
import { jwtDecode } from 'jwt-decode';

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // ✅ type safe
  const router = useRouter();

  // Ambil user dari token client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode<User & { id: string }>(token);
          setUser(decoded);
        } catch (err) {
          console.error('Failed to decode token:', err);
        }
      }
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/events/organizer');
      setEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  const openDeleteModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEventId) return;
    try {
      await api.delete(`/events/${selectedEventId}`);
      toast.success('Event berhasil dihapus!');
      fetchEvents();
    } catch {
      toast.error('Gagal menghapus event.');
    } finally {
      setShowModal(false);
      setSelectedEventId(null);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <main className="p-4 min-h-screen bg-sky-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.email} 👋</h1>
            <p className="text-gray-600 text-sm">Role: {user.role}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/create-event')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              + Create Event
            </button>
            <LogoutButton />
          </div>
        </div>

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada event yang dibuat.</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="p-4 border rounded shadow bg-white">
                  <Link href={`/dashboard/events/${event.id}`}>
                    <h2 className="text-lg font-bold hover:underline">{event.name}</h2>
                  </Link>
                  <p>{event.location}</p>
                  <p>{new Date(event.startDate).toLocaleString()}</p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => router.push(`/events/${event.id}/edit`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(event.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Confirm Delete Modal */}
        {showModal && (
          <ConfirmModal
            title="Delete Event"
            message="Are you sure you want to delete this event?"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowModal(false)}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}
