import type { Request } from "express";
import type { User } from "@prisma/client";
import type { UserResponse } from "../api/dto";
import type { AdminPutUserDto, UserFilter, PatchUserDto } from "../shared/dto/user.type.dto";
import { SharedMapper } from "./shared.mapper";


export class UserMapper extends SharedMapper {

  static fromEntitytoUserResponse(user: User): UserResponse {
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
  
  static fromUserRequestToFilterDto = (req: Request): UserFilter => {
    const filter: UserFilter = {
      email: typeof req.query.email === "string" ? req.query.email : undefined,
      role:
        typeof req.query.role === "string"
          ? (req.query.role as any)
          : undefined,
      isEnabled: req.query.isEnabled as boolean | undefined,
      q: typeof req.query.q === "string" ? req.query.q : undefined,
    };

    return filter;
  };

  static fromUserUpdateRequestToDto = (input: AdminPutUserDto): AdminPutUserDto => {
    const dto: AdminPutUserDto = {};
    if (input.firstName !== undefined) dto.firstName = input.firstName;
    if (input.lastName !== undefined) dto.lastName = input.lastName;
    if (input.email !== undefined) dto.email = input.email;
    if (input.password !== undefined) dto.password = input.password;
    if (input.phone !== undefined) dto.phone = input.phone;
    if (input.role !== undefined) dto.role = input.role;
    if (input.isEnabled !== undefined) dto.isEnabled = input.isEnabled;
    return dto;
  };

  static fromUserPatchRequestToDto = (input: PatchUserDto): PatchUserDto => {
    const dto: PatchUserDto = {};
    if (input.firstName !== undefined) dto.firstName = input.firstName;
    if (input.lastName !== undefined) dto.lastName = input.lastName;
    if (input.phone !== undefined) dto.phone = input.phone;
    return dto;
  };

  static createAdminPutUserDto = (input : AdminPutUserDto, currentUser: User, passwordHash: string | undefined) => {
    return {
          id: currentUser.id,
          email: input.email ?? currentUser.email,
          passwordHash: passwordHash ?? currentUser.passwordHash,
          phone: input.phone ?? currentUser.phone,
          firstName: input.firstName ?? currentUser.firstName,
          lastName: input.lastName ?? currentUser.lastName,
          role: input.role ?? currentUser.role,
          isEnabled: input.isEnabled ?? currentUser.isEnabled,
        } as Partial<User>
  }  


    static createPatchUserDto = (input : PatchUserDto, currentUser: User) => {
    return {
          id: currentUser.id,
          phone: input.phone ?? currentUser.phone,
          firstName: input.firstName ?? currentUser.firstName,
          lastName: input.lastName ?? currentUser.lastName,
        } as Partial<User>
  }  

  private static parseBooleanQueryParam = (val: any): boolean | undefined => {
    const v = val.toLowerCase().trim();
    if (v === "true") return true;
    if (v === "false") return false;
  };
}
