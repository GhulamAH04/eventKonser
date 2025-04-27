"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Event } from "@/interface/event";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch {
        setEvent(null); // not found
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading event...</p>;
  if (!event)
    return <p className="text-center p-6 text-red-500">Event not found.</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.name}</h1>

      <div className="text-gray-600 text-sm mb-6">
        <p>{event.location}</p>
        <p>
          {new Date(event.startDate).toLocaleString()} –{" "}
          {event.endDate ? new Date(event.endDate).toLocaleString() : "-"}
        </p>
      </div>

      {event.promotion && event.promotion.length > 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6">
          <h2 className="text-lg font-bold mb-2">🎉 Promo Available!</h2>
          {event.promotion.map((promo) => (
            <div key={promo.id} className="text-sm">
              <p>
                Code: <strong>{promo.code}</strong>
              </p>
              <p>Discount: IDR {promo.discount.toLocaleString()}</p>
              <p>
                Valid: {new Date(promo.startDate).toLocaleDateString()} –{" "}
                {new Date(promo.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-2">About This Event</h2>
        <p className="text-gray-700 leading-relaxed">
          {event.description || "No description available."}
        </p>
      </section>

      <section className="p-6 border rounded shadow bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">Ticket Information</h3>
        <p className="text-2xl font-bold text-blue-600 mb-4">
          {event.price === 0 ? "FREE" : `IDR ${event.price.toLocaleString()}`}
        </p>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          onClick={() => alert("Redirect to Transaction Form")}
        >
          Buy Ticket
        </button>
      </section>
    </main>
  );
}

/*
import api from "@/lib/axios";
import { notFound } from "next/navigation";
import { Event } from "@/types/event";

type Params = { params: { id: string } };

export default async function EventDetail({ params }: Params) {
  let event: Event | null = null;

  try {
    const res = await api.get(`/events/${params.id}`);
    event = res.data;
  } catch {
    return notFound(); // jika gagal fetch
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{event!.name}</h1>
      <p className="text-gray-600">{event!.location}</p>
      <p className="text-sm">
        {new Date(event!.startDate).toLocaleString()} –{" "}
        {event!.endDate ? new Date(event!.endDate).toLocaleString() : "-"}
      </p>
      <p className="mt-4">
        {event!.description || "No description available."}
      </p>
      <p className="mt-4 font-semibold">
        Price:{" "}
        {event!.price === 0 ? "FREE" : `IDR ${event!.price!.toLocaleString()}`}
      </p>
      {event!.promotion && event!.promotion.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-bold mb-2">Available Promotion</h2>
          {event!.promotion.map((promo) => (
            <div key={promo.id} className="mb-4">
              <p className="font-semibold">Code: {promo.code}</p>
              <p>Discount: IDR {promo.discount.toLocaleString()}</p>
              <p>
                Valid: {new Date(promo.startDate).toLocaleDateString()} –{" "}
                {new Date(promo.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
      {event!.promotion && event!.promotion.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-bold mb-2">Available Promotion</h2>
          {event!.promotion.map((promo) => (
            <div key={promo.id} className="mb-4">
              <p className="font-semibold">Code: {promo.code}</p>
              <p>Discount: IDR {promo.discount.toLocaleString()}</p>
              <p>
                Valid: {new Date(promo.startDate).toLocaleDateString()} –{" "}
                {new Date(promo.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
*/
