import type { UUIDTypes } from "uuid";

interface RoleType {
  roleId: UUIDTypes;
  title: string;
  level: number;
  description?: string;
}

interface UserCredentials {
  userId?: UUIDTypes;
  roleId?: UUIDTypes;
  level?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  repeatPassword?: string;
  dateOfBirth?: Date;
  isVerified?: boolean;
  isBanned?: boolean;
  roleTitle?: RoleType;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  dateOfBirth: string;
}

export type { UserCredentials, LoginCredentials, RegisterCredentials };
