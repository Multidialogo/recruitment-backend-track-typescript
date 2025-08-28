import { UserRepository } from "../repository/user.repository";
import type {
  UserResponse,
  PaginatedUsers,
  PageParameter,
  PageSizeParameter,
  UserCreateRequest,
  UserUpdateRequest,
} from "../api/dto";
import { UserMapper } from "../mapper/user.mapper";
import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import type { UserFilter } from "../shared/dto/user.filter.dto";
import { BadRequestError, NotFoundError } from "../errors/http-errors";
import { log } from "console";

export class UserService {
  constructor(private readonly repository = new UserRepository()) {}

  getAllUsers = async (
    userData: UserFilter,
    page: PageParameter,
    pageSize: PageSizeParameter
  ): Promise<PaginatedUsers> => {
    const pageResult = await this.repository.findPage(userData, page, pageSize);

    return {
      ...pageResult,
      data: pageResult.data.map((user) => UserMapper.entitytoUserResponse(user)),
    };
  };

  getUserById = async (id: bigint): Promise<UserResponse> => {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError("User not found", { id: id.toString() });
    return UserMapper.entitytoUserResponse(user);
  };

  createUser = async (input: UserCreateRequest): Promise<{ id: string }> => {
    const { email, password, firstName, lastName, role, phone } = input;

    if (!email?.trim() || !password?.trim()) {
      throw new BadRequestError("Email and Password are required");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return this.repository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      phone,
    } as Partial<User>);
  };

  updateUser = async (id: bigint, input: UserUpdateRequest) : Promise<UserResponse> => {
    const currentUser = await this.repository.findById(id);
    if (!currentUser) throw new NotFoundError("User not found", { id: id.toString() });

    let passwordHash: string | undefined = undefined;
    if (input.password) {
      passwordHash = await bcrypt.hash(input.password, 10);
    }

    if (input.email && input.email !== currentUser.email) {
       await this.checkEmailExists(input.email);
    }

    const updated = await this.repository.updateById({
      id: id,
      email: input.email ?? currentUser.email,
      passwordHash: passwordHash ?? currentUser.passwordHash,
      phone: input.phone ?? currentUser.phone,
      firstName: input.firstName ?? currentUser.firstName,
      lastName: input.lastName ?? currentUser.lastName,
      role: input.role ?? currentUser.role,
      isEnabled: input.isEnabled ?? currentUser.isEnabled,
    } as Partial<User>);

    return UserMapper.entitytoUserResponse(updated);
  }

  deleteUser = async (id: bigint): Promise<void> => {
    const currentUser = await this.repository.findById(id);
    if (!currentUser) throw new NotFoundError("User not found", { id: id.toString() });
    await this.repository.delete(id);
  }

  private checkEmailExists = async (email: string): Promise<void> => {
    const existing = await this.repository.findByEmailRaw(email);
    if (existing) {
      throw {
        message: "Conflict error",
        status: 400,
        detail: "Email already in use",
      };
    }
  }
}
