import type { EnvironmentType } from "../types/env.js";

const environment: EnvironmentType = {
  env: (process.env.NODE_ENV as unknown as string) || "local",
  port: (process.env.PORT as unknown as number) || 9000,
  databaseUrl: process.env.DATABASE_URL as string,
};

export default environment;
