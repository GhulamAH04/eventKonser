"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function UploadProofPage() {
  const { id } = useParams();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("proof", file);

    setLoading(true);
    try {
      await api.put(`/transactions/${id}/upload-proof`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Proof uploaded successfully!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to upload proof");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Payment Proof</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="input"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </main>
  );
}
