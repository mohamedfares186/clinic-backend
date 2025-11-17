import { logger } from "../middleware/logger.js";
import { Role } from "../models/index.js";

const Roles = async () => {
  try {
    return await Role.bulkCreate([
      { title: "admin", level: 9999 },
      { title: "user", level: 1234 },
    ]);
  } catch (error) {
    logger.error(`Error initiating default roles - ${error}`);
    return;
  }
};

export default Roles;
