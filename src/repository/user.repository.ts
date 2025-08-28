import { Prisma, PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
import type {
  PageParameter,
  PageSizeParameter,
} from "../api/dto";
import type { UserFilter } from "../shared/dto/user.filter.dto";
import type { PaginationDto } from "../shared/dto/pagination.dto";

const prisma = new PrismaClient();

export class UserRepository {

  private toSkipTake = (page = 1, pageSize = 10) => ({
    skip: Math.max(0, (page - 1) * pageSize),
    take: pageSize,
  });

  private whereCondition = (filter: UserFilter = {}): Prisma.UserWhereInput => {
    const { email, role, isEnabled, q } = filter;
    const where: Prisma.UserWhereInput = {};
    if (email) where.email = { contains: email, mode: "insensitive" };
    if (role) where.role = role;
    if (typeof isEnabled === "boolean") where.isEnabled = isEnabled;
    if (q)
      where.OR = [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { email: { contains: q } },
      ];
    return where;
  };

  findPage = async (filter: UserFilter, page: PageParameter, pageSize: PageSizeParameter):
   Promise<PaginationDto> =>{
    page = page ?? 1;
    pageSize = pageSize ?? 10;
    const where = this.whereCondition(filter);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        ...this.toSkipTake(page, pageSize),
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    const paginatedUsers: PaginationDto = {
      data: users,
      pageSize: pageSize,
      page: page,
      total: total,
    };

    return paginatedUsers;
  }

  findById = async (id: bigint): Promise<User | null> => {
    return (await prisma.user.findUnique({ where: { id } })) as User | null;
  }

  findByEmailRaw = async(email: string) => {
    return prisma.user.findUnique({ where: { email } });
  }

  create = async (data: Partial<Omit<User,"id" | "createdAt" | "updatedAt" | "associations" | "taxProfile">>
  ): Promise<{ id: string }> => {
    const created = await prisma.user.create({
      data: data as any,
      select: { id: true },
    });
    return { id: created.id.toString() };
  }

  updateById = async (data: Partial<Omit<User, "associations" | "taxProfile">>
  ): Promise<User> => {
    const id = data.id;
    if (!id) {
      throw new Error("ID is required for update");
    }
    return (await prisma.user.update({ where: { id }, data })) as User;
  }

  delete = async (id: bigint): Promise<void>  => {
    await prisma.user.delete({ where: { id }});
  }
}
