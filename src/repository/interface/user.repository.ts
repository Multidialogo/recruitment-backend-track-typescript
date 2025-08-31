import type { User } from "@prisma/client";
import type {PageParameter,PageSizeParameter,CreatedId} from "../../api/dto";
import type { UserFilter } from "../../shared/dto/user.type.dto";
import type { PaginationDto } from "../../shared/dto/pagination.dto";

export interface UserRepository {
  findAll (filter: UserFilter, page: PageParameter, pageSize: PageSizeParameter) : Promise<PaginationDto>;
  findById (id: bigint): Promise<User | null>;
  create(data: Partial<Omit<User,"id" | "createdAt" | "updatedAt" | "associations" | "taxProfile">>): Promise<CreatedId>;
  updateById (data: Partial<Omit<User, "associations" | "taxProfile">>): Promise<User>;
  deleteById (id: bigint): Promise<void>;
}
