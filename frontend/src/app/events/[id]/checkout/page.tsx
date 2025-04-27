"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Event } from "@/interface/event";

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pointBalance, setPointBalance] = useState(0);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, userRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get("/me"),
        ]);
        setEvent(eventRes.data);
        setPointBalance(userRes.data.pointBalance);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!event)
    return <p className="text-center p-6 text-red-500">Event not found</p>;

  const ticketPrice = event.price * quantity;
  const discount = Math.min(pointsUsed, ticketPrice);
  const finalPrice = ticketPrice - discount;

  const handleCheckout = async () => {
    try {
      await api.post("/transactions", {
        eventId: event.id,
        quantity,
        pointUsed: pointsUsed,
      });
      toast.success("Checkout successful!");
      router.push("/thank-you");
    } catch (err) {
      console.error(err);
      toast.error("Failed to checkout");
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout - {event.name}</h1>

      <div className="space-y-4">
        <div className="border p-4 rounded shadow">
          <p>
            <strong>Price per ticket:</strong> IDR{" "}
            {event.price.toLocaleString()}
          </p>
          <p>
            <strong>Quantity:</strong>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded p-2 w-20 ml-2"
            />
          </p>
          <p className="mt-2">
            <strong>Point Balance:</strong> {pointBalance} points
          </p>
          <p className="mt-2">
            <strong>Use Points:</strong>
            <input
              type="number"
              value={pointsUsed}
              min={0}
              max={Math.min(pointBalance, ticketPrice)}
              onChange={(e) => setPointsUsed(Number(e.target.value))}
              className="border rounded p-2 w-20 ml-2"
            />
          </p>
        </div>

        <div className="border p-4 rounded shadow">
          <p>
            <strong>Final Price:</strong> IDR {finalPrice.toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Confirm Purchase
        </button>
      </div>
    </main>
  );
}
