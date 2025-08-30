import type { UserRole } from "@prisma/client";


export type UserFilter = {
  email?: string;
  role?: UserRole;
  isEnabled?: boolean;
  q?: string;
};

export type AdminPutUserDto = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  password?: string;         
  phone?: string | null;
  role?: "USER" | "ADMIN";
  isEnabled?: boolean;
}; 


export type PatchUserDto = {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};