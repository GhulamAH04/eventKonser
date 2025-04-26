"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔥 Hapus token dari localStorage
    router.push("/login"); // 🔥 Redirect ke login
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      Logout
    </button>
  );
}
