// ✅ Signup Page - app/signup/page.tsx

"use client";

import { useState } from "react";

export default function SignupPage() {
  const [role, setRole] = useState<"user" | "organizer">("user");

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side (Text) */}
      <div className="bg-blue-50 p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Join EventKonser</h1>
        <p className="text-gray-600 text-lg">
          {role === "user"
            ? "Attend amazing concerts and enjoy exclusive deals."
            : "Host and manage your concerts with ease."}
        </p>
      </div>

      {/* Right Side (Form) */}
      <div className="p-10 flex flex-col justify-center">
        {/* Tab Switcher */}
        <div className="flex gap-6 mb-6">
          <button
            className={`font-semibold ${
              role === "user" ? "text-blue-600" : "text-gray-400"
            }`}
            onClick={() => setRole("user")}
          >
            Participant
          </button>
          <button
            className={`font-semibold ${
              role === "organizer" ? "text-blue-600" : "text-gray-400"
            }`}
            onClick={() => setRole("organizer")}
          >
            Organizer
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <input placeholder="Full Name" className="input" />
          <input type="email" placeholder="Email" className="input" />
          <input type="password" placeholder="Password" className="input" />
          <input
            type="text"
            placeholder="Referral Code (optional)"
            className="input"
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Sign Up as {role === "user" ? "Participant" : "Organizer"}
          </button>
        </form>
      </div>
    </main>
  );
}
