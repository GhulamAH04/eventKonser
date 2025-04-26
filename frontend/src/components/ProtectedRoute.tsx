"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <>{children}</> 
  );
}
