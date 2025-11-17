import type { Request, Response } from "express";
import { logger } from "../../../middleware/logger.js";
import LogoutService from "../services/logout.js";
import environment from "../../../config/env.js";

const { env } = environment;

class LogoutController {
  constructor(protected logoutService = new LogoutService()) {
    this.logoutService = logoutService;
  }

  logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const token = req.cookies["refresh-token"];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No active session found",
        });
      }

      const result = await this.logoutService.logout(token);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.clearCookie("refresh-token", {
        httpOnly: true,
        secure: env === "production",
        sameSite: "strict",
      });

      res.clearCookie("access-token", {
        httpOnly: true,
        secure: env === "production",
        sameSite: "strict",
      });

      return res.status(200).json(result);
    } catch (error) {
      logger.error(`Error in logout controller - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default LogoutController;
