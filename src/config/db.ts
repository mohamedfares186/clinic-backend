import { Sequelize } from "sequelize";
import type { Dialect, Options as SequelizeOptions } from "sequelize";
import environment from "./env.js";
import { logger } from "../middleware/logger.js";

const { env, databaseUrl } = environment;

const PRODUCTION: boolean = env === "production" && !!databaseUrl;
const STAGING: boolean = env === "staging" && !!databaseUrl;
const DEVELOPMENT: boolean = env === "development";
const TEST: boolean = env === "test";
const DIALECT: Dialect = PRODUCTION || STAGING ? "postgres" : "sqlite";
const STROAGE: string =
  PRODUCTION || STAGING || DEVELOPMENT
    ? (databaseUrl as string)
    : TEST
    ? "database/test.sqlite3"
    : "database/local.sqlite3";

const database: SequelizeOptions = {
  dialect: DIALECT,
  storage: STROAGE,
};

const sequelize = new Sequelize(database);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    if (PRODUCTION || STAGING || DEVELOPMENT) {
      await sequelize.sync({ alter: true });
    } else {
      await sequelize.sync({ force: true });
    }
    logger.info(`Database has been connected and synced successfully`);
  } catch (error) {
    logger.error(`Error connecting to the database - ${error}`);
  }
};

export default sequelize;
