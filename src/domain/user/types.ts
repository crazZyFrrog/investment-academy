export type UserRole = "guest" | "student" | "admin";

export interface User {
  id: string;
  email?: string;
  name?: string;
  role: UserRole;
  createdAt: string;
}
