import type { Response } from "express";
import ReadOneUserService from "../services/readOneUser.js";
import type { UserRequest } from "../../../types/request.js";
import { logger } from "../../../middleware/logger.js";

class ReadOneUserController {
  constructor(protected user = new ReadOneUserService()) {
    this.user = user;
  }

  readUser = async (req: UserRequest, res: Response) => {
    try {
      const { userId } = req.body;

      if (!userId)
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });

      const user = await this.user.findOneUser(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      return res.status(200).json({ success: true, message: user.message });
    } catch (error) {
      logger.error(`Error fetching user data - ${error}`);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };
}

export default ReadOneUserController;
