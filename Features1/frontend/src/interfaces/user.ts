export interface User {
  id: string;
  email: string;
  role: "CUSTOMER" | "ORGANIZER" | "ADMIN";
}
