import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import UpdateUserService from "../services/updateUser.js";
import { logger } from "../../../middleware/logger.js";

class UpdateUserController {
  constructor(protected user = new UpdateUserService()) {
    this.user = user;
  }

  updateUser = async (req: UserRequest, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId)
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });

      const user = this.user.banUser(userId);
      if (!user)
        return res
          .status(500)
          .json({ success: false, message: "Couldn't ban user" });

      return res.status(200).json({
        success: true,
        message: "User has been banned successfully",
      });
    } catch (error) {
      logger.error(`Error Updating user status - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  };
}

export default UpdateUserController;
