"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Event } from "@/types/event";
import { toast } from "react-hot-toast";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<Partial<Event>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const event = res.data;
        setForm({
          ...event,
          startDate: event.startDate
            ? new Date(event.startDate).toISOString().slice(0, 16)
            : "",
          endDate: event.endDate
            ? new Date(event.endDate).toISOString().slice(0, 16)
            : "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.startDate || !form.endDate) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      setSaving(true);
      await api.put(`/events/${id}`, {
        ...form,
        price: Number(form.price),
      });
      toast.success("Event updated!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6 max-w-xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-300 rounded"></div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Event Name"
          className="input"
          required
        />
        <input
          name="location"
          value={form.location || ""}
          onChange={handleChange}
          placeholder="Location"
          className="input"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price || 0}
          onChange={handleChange}
          placeholder="Price (IDR)"
          className="input"
        />
        <input
          name="startDate"
          type="datetime-local"
          value={form.startDate || ""}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="endDate"
          type="datetime-local"
          value={form.endDate || ""}
          onChange={handleChange}
          className="input"
          required
        />
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="input"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Update Event"}
        </button>
      </form>
    </main>
  );
}
