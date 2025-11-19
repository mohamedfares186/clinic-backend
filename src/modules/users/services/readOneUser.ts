import type { UUIDTypes } from "uuid";
import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";

class ReadOneUserService {
  async findOneUser(userId: UUIDTypes) {
    try {
      if (!userId)
        return {
          success: false,
          message: "User ID is required",
        };

      const user = await User.findOne({
        where: {
          userId,
        },
      });

      if (!user)
        return {
          success: false,
          message: "User not found",
        };

      return {
        success: false,
        message: "User found",
        user: user,
      };
    } catch (error) {
      logger.error(`Error fetching one user - ${error}`);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
}

export default ReadOneUserService;
