import { jwtDecode } from "jwt-decode";
import { User } from "@/interfaces";

export const getToken = () => localStorage.getItem("token");

export const getUserFromToken = (): User | null => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
};
