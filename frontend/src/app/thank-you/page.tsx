"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/"); // Redirect back to home after 5 seconds
    }, 5000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-4 animate-fade-in">🎉 Thank You!</h1>
      <p className="text-gray-600 mb-6 animate-fade-in">
        Your ticket purchase was successful. We will see you at the event!
      </p>
      <p className="text-sm text-gray-400 animate-fade-in">
        Redirecting you back to homepage...
      </p>
    </main>
  );
}
