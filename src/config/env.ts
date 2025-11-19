import type { EnvironmentType } from "../types/env.js";

const environment: EnvironmentType = {
  env: (process.env.NODE_ENV as unknown as string) || "local",
  port: (process.env.PORT as unknown as number) || 9000,
  frontendUrl: process.env.FRONTEND_URL as unknown as string,
  databaseUrl: process.env.DATABASE_URL as unknown as string,
  jwtSecret: process.env.JWT_SECRET as unknown as string,
  secureSecret: process.env.SECURE_TOKEN_SECRET as unknown as string,
  emailHost: process.env.EMAIL_HOST as unknown as string,
  emailPort: process.env.EMAIL_PORT as unknown as number,
  emailUser: process.env.EMAIL_USER as unknown as string,
  emailPass: process.env.EMAIL_PASS as unknown as string,
};

export default environment;
