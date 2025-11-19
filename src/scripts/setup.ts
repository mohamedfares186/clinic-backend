import Roles from "./roles.js";
import Permissions from "./permissions.js";
import AdminUser from "./admin.js";
import "../models/index.js";
import { connectDB, syncDB } from "../config/db.js";
import { logger } from "../middleware/logger.js";

const admin = new AdminUser();

async function setup(): Promise<void> {
  try {
    await connectDB();
    await syncDB();

    await Roles();
    await Permissions();
    await admin.Run();
    logger.info("Setup completed successfully.");
  } catch (error) {
    logger.error("Setup failed:", error);
  }
}

setup();
