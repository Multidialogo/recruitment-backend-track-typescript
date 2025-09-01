import { UserServiceImpl } from "../../service/user.service.impl";
import {UserRepositoryImpl } from "../../repository/user.repository.impl";
import { cleanDatabase, prisma } from "../db-setup";
import { validUserInsertDto } from "../fixture/user.fixture";
import { BadRequestError, ConflictError, NotFoundError } from "../../error/http-errors";
import { PageParameter, PageSizeParameter } from "../../api/dto";
import { PatchUserDto, UserFilter } from "../../shared/dto/user.type.dto";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(async (pwd: string) => `hashed:${pwd}`),
  },
}));

describe("UserService (integrazione con repo + prisma di test)", () => {
  let userService: UserServiceImpl;
  let userRepository: UserRepositoryImpl;

  beforeEach(async () => {
    await cleanDatabase();
    userRepository = new UserRepositoryImpl(prisma);
    userService = new UserServiceImpl(userRepository);
  });

  // ============ getUserById ============
  describe("getUserById", () => {
    it("should return user when found", async () => {
      const created = await userService.createUser(validUserInsertDto);
      const found = await userService.getUserById(BigInt(created.id!));

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.email).toBe(validUserInsertDto.email);
    });

    it("should throw NotFoundError when user not found", async () => {
      await expect(userService.getUserById(BigInt(999)))
                              .rejects.toBeInstanceOf(NotFoundError);
    });
  });

  // ============ getAllUsers ============
  describe("getAllUsers", () => {

    it("should return paginated & mapped users", async () => {
      const base = { ...validUserInsertDto };
      for (let i = 0; i < 3; i++) {
        await userService.createUser({
          ...base,
          email: `u${i}.${base.email}`,
        });
      }

      const page = 1 as PageParameter;  
      const pageSize = 10 as PageSizeParameter;
      const res = await userService.getAllUsers({}, page, pageSize);

      expect(res.page).toBe(page);
      expect(res.pageSize).toBe(pageSize);
      expect(res.total).toBeGreaterThanOrEqual(3);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(3);
      expect(typeof res.data[0].id).toBe("string");
      expect(res.data[0]).toHaveProperty("email");
    });

    it("should support q filter (if repo implements it)", async () => {
      await userService.createUser({ ...validUserInsertDto, email: "mario@test.io", firstName: "Mario" });
      await userService.createUser({ ...validUserInsertDto, email: "luigi@test.io", firstName: "Luigi" });

      const res = await userService.getAllUsers({
                                                 q: "mario" } as UserFilter, 
                                                 1 as PageParameter,
                                                 10 as PageSizeParameter);
      expect(res.data.length).toBeGreaterThanOrEqual(1);
      expect(res.data.some(u => u.email === "mario@test.io")).toBe(true);
      expect(res.data.some(u => u.firstName === 'Mario'));
    });
  });

  // ============ createUser ============
  describe("createUser", () => {
    it("should create user and return id", async () => {
      const created = await userService.createUser(validUserInsertDto);

      expect(created).toHaveProperty("id");
    });

    it("should throw BadRequestError when email is blank", async () => {
      await expect(
        userService.createUser({ ...validUserInsertDto, email: "   " })
      ).rejects.toBeInstanceOf(BadRequestError);
    });

    it("should throw BadRequestError when password is blank", async () => {
      await expect(
        userService.createUser({ ...validUserInsertDto, password: "   " })
      ).rejects.toBeInstanceOf(BadRequestError);
    });
  });

  // ============ updateUser ============
  describe("updateUser", () => {
    it("should throw NotFoundError when user does not exist", async () => {
      await expect(
        userService.updateUser(BigInt(123456), { firstName: "X" } as any)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("should update fields and (optionally) password", async () => {
      const created = await userService.createUser(validUserInsertDto);

      const updated = await userService.updateUser(BigInt(created.id!), {
        firstName: "NewName",
        password: "newpw",
      } as any);

      expect(updated.firstName).toBe("NewName");
    });
  });

  // ============ patchUser ============
  describe("patchUser", () => {
    it("should throw NotFoundError when user does not exist", async () => {
      await expect(
        userService.patchUser(BigInt(999999), { firstName: "X" } as any)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("should apply partial update", async () => {
      const created = await userService.createUser(validUserInsertDto);

      const patched = await userService.patchUser(BigInt(created.id!), { firstName: "After" } as PatchUserDto);
      expect(patched.firstName).toBe("After");
    });
  });

  // ============ deleteUser ============
  describe("deleteUser", () => {
    it("should throw NotFoundError when user does not exist", async () => {
      await expect(userService.deleteUser(BigInt(1234))).rejects.toBeInstanceOf(NotFoundError);
    });

    it("should delete existing user", async () => {
      const created = await userService.createUser(validUserInsertDto);

      await userService.deleteUser(BigInt(created.id!));

      const inDb = await prisma.user.findUnique({ where: { id: BigInt(created.id!) } });
      expect(inDb).toBeNull();
    });
  });
});
