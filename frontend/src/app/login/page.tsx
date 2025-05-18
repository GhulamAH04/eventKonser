/*
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.accessToken;

      localStorage.setItem("token", token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </main>
  );
}
*/


//  Login Page - app/login/page.tsx

"use client";

import { useState } from "react";
import Navbar from "@/components/NavBar";
export default function LoginPage() {
  const [role, setRole] = useState<"user" | "organizer">("user");
  const [search, setSearch] = useState('');

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Navbar */}
      <Navbar search={search} setSearch={setSearch} /> {/* Menambahkan Navbar di bagian atas */}
      {/* Left Side */}
      <div className="bg-blue-100 p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-gray-600">
          {role === 'user'
            ? 'Login to browse and buy concert tickets.'
            : 'Login to manage your events.'}
        </p>
      </div>
      {/* Right Side */}
      <div className="p-10 flex flex-col justify-center">
        {/* Toggle Role */}
        <div className="flex gap-6 mb-6">
          <button
            className={`font-semibold ${role === 'user' ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => setRole('user')}
          >
            Participant
          </button>
          <button
            className={`font-semibold ${role === 'organizer' ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => setRole('organizer')}
          >
            Organizer
          </button>
        </div>

        {/* Login Form */}
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="input" />
          <input type="password" placeholder="Password" className="input" />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login as {role === 'user' ? 'Participant' : 'Organizer'}
          </button>
        </form>
      </div>
    </main>
  );
}
