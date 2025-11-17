interface EnvironmentType {
  env: string;
  port: number;
  databaseUrl?: string;
  jwtSecret?: string;
  secureSecret?: string;
  emailHost?: string;
  emailPort?: number;
  emailUser?: string;
  emailPass?: string;
}

export type { EnvironmentType };
