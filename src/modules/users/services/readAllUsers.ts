import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";

class ReadUsersService {
  async readAllUsers() {
    try {
      const users = await User.findAll();
      if (!users || users.length === 0) {
        return {
          success: false,
          message: "There is no users to show",
        };
      }

      return {
        success: true,
        message: "Users found successfully",
        users: users,
      };
    } catch (error) {
      logger.error(`Error fetching users - ${error}`);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
}

export default ReadUsersService;
