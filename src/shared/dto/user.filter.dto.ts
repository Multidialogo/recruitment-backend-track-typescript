import type { UserRole } from "@prisma/client";

export type UserFilter = {
  email?: string;
  role?: UserRole;
  isEnabled?: boolean;
  q?: string;
};