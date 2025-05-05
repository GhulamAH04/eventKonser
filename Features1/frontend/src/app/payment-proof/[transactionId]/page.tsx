'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { uploadPaymentProof } from '@/app/transaction/transaction/transactionService';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function PaymentProofPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 🔥 Validasi ukuran maksimal 2MB
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB!');
        return;
      }
      // 🔥 Validasi format harus jpg/jpeg/png
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format file harus JPG atau PNG!');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !transactionId) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('payment_proof', selectedFile);

      await uploadPaymentProof(transactionId, formData);
      toast.success('Bukti pembayaran berhasil diupload!');
      router.push('/payment-success');
    } catch (error) {
      console.error(error);
      toast.error('Gagal upload bukti pembayaran.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar />

      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-12 gap-8 mt-24">
        <h1 className="text-3xl md:text-5xl font-bold text-sky-700 text-center">
          Upload Bukti Pembayaran
        </h1>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />

          {previewUrl && (
            <div className="flex justify-center">
              <Image
                src={previewUrl}
                alt="Preview"
                width={300}
                height={300}
                className="h-64 object-contain rounded-lg border mt-4"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition ${
              isUploading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Mengupload...' : 'Upload Bukti'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
