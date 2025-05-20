'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';;
import { useParams, useRouter } from 'next/navigation';
import { Event } from '@/interfaces';
import { toast } from 'react-hot-toast';

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<Partial<Event>>({
    name: '',
    description: '',
    location: '',
    price: 0,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (id) {
      api
        .get(`/events/${id}`)
        .then((res) => {
          const data: Event = res.data;
          setForm({
            ...data,
            price: Number(data.price),
            startDate: data.startDate.slice(0, 16), // format datetime-local
            endDate: data.endDate?.slice(0, 16) || '',
          });
        })
        .catch(() => {
          toast.error('Failed to load event');
          router.push('/dashboard');
        });
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, {
        ...form,
        price: Number(form.price),
        startDate: new Date(form.startDate!).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      });
      toast.success('Event updated!');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to update event');
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <input
          name="name"
          value={form.name || ''}
          onChange={handleChange}
          placeholder="Event Name"
          className="input"
        />
        <input
          name="location"
          value={form.location || ''}
          onChange={handleChange}
          placeholder="Location"
          className="input"
        />
        <input
          name="price"
          type="number"
          value={form.price ?? 0}
          onChange={handleChange}
          placeholder="Price"
          className="input"
        />
        <input
          name="startDate"
          type="datetime-local"
          value={form.startDate || ''}
          onChange={handleChange}
          className="input"
        />
        <input
          name="endDate"
          type="datetime-local"
          value={form.endDate || ''}
          onChange={handleChange}
          className="input"
        />
        <textarea
          name="description"
          value={form.description || ''}
          onChange={handleChange}
          placeholder="Description"
          className="input"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Update Event
        </button>
      </form>
    </main>
  );
}