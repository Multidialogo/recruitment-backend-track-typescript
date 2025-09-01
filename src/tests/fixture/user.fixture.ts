import { UserRole, UserCreateRequest } from "../../api/dto";


export const validUserInsertDto: UserCreateRequest = {
  firstName: 'Mario',
  lastName: 'Rossi',
  email: 'mario.rossi@test.com',
  password: 'password123',
  role: UserRole.USER
};

export const validAdminUserInsertDto: UserCreateRequest = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@test.com',
  password: 'admin123',
  role: UserRole.ADMIN
};

export const invalidUserInsertDto = {
  firstName: '',
  lastName: 'Rossi',
  email: 'invalid-email',
  password: '123', // Password troppo corta
  role: 'INVALID_ROLE'
};