import { logger } from "../../../middleware/logger.js";
import Session from "../../users/models/sessions.js";

interface LogoutResult {
  success: boolean;
  message: string;
}

class LogoutService {
  async logout(token: string): Promise<LogoutResult> {
    try {
      if (!token) {
        return {
          success: false,
          message: "No session token provided",
        };
      }

      const session = await Session.findOne({ where: { token } });

      if (!session) {
        return {
          success: false,
          message: "Invalid session",
        };
      }

      if (session.isRevoked) {
        return {
          success: true,
          message: "Session already logged out",
        };
      }

      const [updatedRows] = await Session.update(
        { isRevoked: true },
        { where: { token } }
      );

      if (updatedRows === 0) {
        return {
          success: false,
          message: "Failed to revoke session",
        };
      }

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      logger.error(`Error during logout - ${error}`);
      return {
        success: false,
        message: "An error occurred during logout",
      };
    }
  }
}

export default LogoutService;
