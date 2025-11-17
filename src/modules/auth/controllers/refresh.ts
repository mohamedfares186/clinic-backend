import type { Response } from "express";
import RefreshService from "../services/refresh.js";
import { logger } from "../../../middleware/logger.js";
import environment from "../../../config/env.js";
import type { UserRequest } from "../../../types/request.js";

const { env } = environment;

class RefreshController {
  constructor(protected refreshService = new RefreshService()) {
    this.refreshService = refreshService;
  }

  refresh = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      const token = req.cookies["refresh-token"];

      if (!userId || !token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Invalid session",
        });
      }

      const result = await this.refreshService.refresh(userId, token);

      if (!result.success || !result.accessToken || !result.refreshToken) {
        const statusCode = result.message.includes("expired") ? 401 : 400;
        return res.status(statusCode).json({
          success: false,
          message: result.message,
        });
      }

      res.cookie("access-token", result.accessToken, {
        httpOnly: true,
        secure: env === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });

      res.cookie("refresh-token", result.refreshToken, {
        httpOnly: true,
        secure: env === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error(`Error in refresh controller: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default RefreshController;
