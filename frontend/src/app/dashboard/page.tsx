"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Event } from "@/interface/event";
import { getUserFromToken } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const user = getUserFromToken();
  const router = useRouter();

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

  if (!user) return null;

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
        <LogoutButton />
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded shadow text-center">
          <h2 className="text-2xl font-bold">{events.length}</h2>
          <p className="text-sm text-gray-600">My Events</p>
        </div>
        {/* Bisa nambah transaksi dll nanti */}
      </div>

      {/* List Events */}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-2">{event.name}</h2>
              <p className="text-gray-600 text-sm">{event.location}</p>
              <p className="text-gray-500 text-sm">
                {event.startDate
                  ? new Date(event.startDate).toLocaleDateString()
                  : "-"}{" "}
                –{" "}
                {event.endDate
                  ? new Date(event.endDate).toLocaleDateString()
                  : "-"}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/events/${event.id}/edit`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

/*
"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { Event } from "@/types/event";
import { getUserFromToken } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
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

  // 🔥 Tambahkan fungsi ini
  const openDeleteModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEventId) return;
    try {
      await api.delete(`/events/${selectedEventId}`);
      toast.success("Event deleted!");
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setShowModal(false);
      setSelectedEventId(null);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <main className="p-4">
        <div className="flex justify-between items-center mb-4">
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
            {events.map((event) => (
              <div key={event.id} className="p-4 border rounded shadow">
                <Link href={`/dashboard/events/${event.id}`}>
                  <h2 className="text-lg font-bold hover:underline">
                    {event.name}
                  </h2>
                </Link>
                <p>{event.location}</p>
                <p>{new Date(event.startDate).toLocaleString()}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => router.push(`/events/${event.id}/edit`)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(event.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 Modal Konfirmasi Delete * / }
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

*/
