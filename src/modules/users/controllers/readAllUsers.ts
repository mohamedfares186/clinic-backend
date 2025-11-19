import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import ReadUsersService from "../services/readAllUsers.js";
import { logger } from "../../../middleware/logger.js";

class ReadAllUsersController {
  constructor(protected users = new ReadUsersService()) {
    this.users = users;
  }

  readUsers = async (req: UserRequest, res: Response) => {
    try {
      const users = this.users.readAllUsers();

      if (!users)
        return res
          .status(404)
          .json({ success: false, message: "No users to display" });

      return res.status(200).json({
        success: true,
        message: "Users found",
        users: users,
      });
    } catch (error) {
      logger.error(`Error fetching users data - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  };
}

export default ReadAllUsersController;
