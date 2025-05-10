'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Event } from '@/interfaces/event'; 
import { getUserFromToken } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const router = useRouter();
  const user = getUserFromToken();

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/organizer/events?userId=${user.id}`);
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
          <LogoutButton />
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
