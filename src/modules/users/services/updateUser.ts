import type { UUIDTypes } from "uuid";
import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";

class UpdateUserService {
  async banUser(userId: UUIDTypes) {
    try {
      if (!userId)
        return {
          success: false,
          message: "User ID is required",
        };

      const banUser = await User.update(
        { isBanned: true },
        { where: { userId } }
      );

      if (!banUser)
        return {
          success: false,
          message: "Couldn't ban user",
        };

      return {
        success: true,
        message: "User has been banned successfully",
      };
    } catch (error) {
      logger.error(`Error Banning user - ${error}`);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
}

export default UpdateUserService;
