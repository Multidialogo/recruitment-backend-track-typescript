import type {
  UserResponse,
  PaginatedUsers,
  PageParameter,
  PageSizeParameter,
  UserCreateRequest} from "../../api/dto";
import type { PatchUserDto, UserFilter} from "../../shared/dto/user.type.dto";

export interface UserService {
  getAllUsers(userData: UserFilter,page: PageParameter,pageSize: PageSizeParameter): Promise<PaginatedUsers>;
  getUserById(id: bigint): Promise<UserResponse>;
  createUser(input: UserCreateRequest): Promise<{ id: string}>;
  patchUser(id: bigint, input: PatchUserDto) : Promise<UserResponse>;
  deleteUser(id: bigint): Promise<void>;
}
