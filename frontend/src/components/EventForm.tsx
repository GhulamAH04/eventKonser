"use client";

import { useState } from "react";
import { EventFormData } from "@/interface/event"; // 🔥 Import hanya EventFormData (jangan Event biasa)

type Props = {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  loading?: boolean;
};

export default function EventForm({
  initialData = {},
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<Partial<EventFormData>>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form as EventFormData); // 🔥 Cast ke EventFormData supaya aman
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <input
        name="name"
        value={form.name || ""}
        onChange={handleChange}
        placeholder="Event Name"
        className="input"
      />
      <input
        name="location"
        value={form.location || ""}
        onChange={handleChange}
        placeholder="Location"
        className="input"
      />
      <input
        name="price"
        type="number"
        value={form.price || ""}
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
      />
      <input
        name="endDate"
        type="datetime-local"
        value={form.endDate || ""}
        onChange={handleChange}
        className="input"
      />
      <input
        name="promotionCode"
        value={form.promotionCode || ""}
        onChange={handleChange}
        placeholder="Promotion Code (optional)"
        className="input"
      />
      <input
        name="promotionDiscount"
        type="number"
        value={form.promotionDiscount || ""}
        onChange={handleChange}
        placeholder="Promotion Discount (IDR)"
        className="input"
      />
      <input
        name="promotionStartDate"
        type="datetime-local"
        value={form.promotionStartDate || ""}
        onChange={handleChange}
        className="input"
      />
      <input
        name="promotionEndDate"
        type="datetime-local"
        value={form.promotionEndDate || ""}
        onChange={handleChange}
        className="input"
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
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
