import type { Request } from "express";
import type { UserFilter } from "../shared/dto/user.filter.dto";
import type { User } from "@prisma/client";
import type { UserResponse } from "../api/dto";


export class UserMapper {

  static entitytoUserResponse(user: User): UserResponse {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || null,
      role: user.role,
      isEnabled: user.isEnabled,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }
  
  static toUserRequestToFilterDto = (req: Request): UserFilter => {
    const filter: UserFilter = {
      email: typeof req.query.email === "string" ? req.query.email : undefined,
      role:
        typeof req.query.role === "string"
          ? (req.query.role as any)
          : undefined,
      isEnabled: this.parseBooleanQueryParam(req.query.isEnabled),
      q: typeof req.query.q === "string" ? req.query.q : undefined,
    };

    return filter;
  };

  private static parseBooleanQueryParam = (val: unknown): boolean | undefined => {
    if (typeof val !== "string") return undefined;
    const v = val.toLowerCase().trim();
    if (v === "true") return true;
    if (v === "false") return false;
  };
}
