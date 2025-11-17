import Roles from "./roles.js";
import Permissions from "./permissions.js";
import AdminUser from "./admin.js";
import { logger } from "..//middleware/logger.js";

const admin = new AdminUser();

try {
  await Roles();
  await Permissions();
  await admin.Run();
} catch (error) {
  logger.error(error);
}
