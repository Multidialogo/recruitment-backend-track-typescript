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
import type { PatchUserDto , AdminPutUserDto, UserFilter} from "../shared/dto/user.type.dto";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/http-errors";

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
      data: pageResult.data.map((user) => UserMapper.fromEntitytoUserResponse(user)),
    };
  };

  getUserById = async (id: bigint): Promise<UserResponse> => {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError("User not found", "id => " + id.toString() );
    return UserMapper.fromEntitytoUserResponse(user);
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

  updateUser = async (id: bigint, input: AdminPutUserDto) : Promise<UserResponse> => {
    const currentUser = await this.repository.findById(id);
    if (!currentUser) throw new NotFoundError("User not found", "id => " + id.toString() );

    let passwordHash: string | undefined = undefined;
    if (input.password) {
      passwordHash = await bcrypt.hash(input.password, 10);
    }

    if (input.email && input.email !== currentUser.email) {
       await this.checkEmailExists(input.email);
    }

    const updated = await this.repository.updateById(
      UserMapper.createAdminPutUserDto(input, currentUser, passwordHash)
    );

    return UserMapper.fromEntitytoUserResponse(updated);
  }

  
  async patchUser(id: bigint, input: PatchUserDto) {
    const currentUser = await this.repository.findById(id);
    if (!currentUser) throw new NotFoundError("User not found", "id => " + id.toString());
    if (Object.keys(input).length === 0) currentUser;

    const updated = await this.repository.updateById(
      UserMapper.createPatchUserDto(input, currentUser)
    );

    return UserMapper.fromEntitytoUserResponse(updated);
  }
  

  deleteUser = async (id: bigint): Promise<void> => {
    const currentUser = await this.repository.findById(id);
    if (!currentUser) throw new NotFoundError("User not found", "id => " + id.toString() );
    await this.repository.delete(id);
  }

  private checkEmailExists = async (email: string): Promise<void> => {
    const existing = await this.repository.findByEmailRaw(email);
    if (existing) new ConflictError("Email already in use", "email => " + email );
  }
}
