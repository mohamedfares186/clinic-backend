import type { Request, Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import EmailService from "../services/email.js";
import { logger } from "../../../middleware/logger.js";

class EmailController {
  constructor(protected emailService = new EmailService()) {
    this.emailService = emailService;
  }

  resend = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.emailService.resend(userId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      logger.error(`Error resending verification email: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  verify = async (req: Request, res: Response): Promise<Response> => {
    try {
      const token = req.params?.token;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Verification token is required",
        });
      }

      const result = await this.emailService.verify(token);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      logger.error(`Error verifying email: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default EmailController;
