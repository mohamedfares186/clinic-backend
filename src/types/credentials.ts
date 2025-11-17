import type { UUIDTypes } from "uuid";

interface User {
  userId: UUIDTypes;
  roleId: UUIDTypes;
  email: string;
  username: string;
  isVerified: boolean;
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

export type { User, LoginCredentials, RegisterCredentials };
