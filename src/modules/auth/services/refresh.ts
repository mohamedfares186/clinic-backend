import { logger } from "../../../middleware/logger.js";
import Tokens from "../../../utils/token.js";
import User from "../../users/models/users.js";
import Session from "../../users/models/sessions.js";
import { v4 as uuidv4, type UUIDTypes } from "uuid";

interface RefreshResult {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

class RefreshService {
  async refresh(userId: UUIDTypes, token: string): Promise<RefreshResult> {
    try {
      if (!userId || !token) {
        return {
          success: false,
          message: "Invalid refresh request",
        };
      }

      const session = await Session.findOne({
        where: {
          token,
          userId,
          isRevoked: false,
        },
      });

      if (!session) {
        return {
          success: false,
          message: "Invalid or revoked session",
        };
      }

      if (session.expiresAt < new Date()) {
        return {
          success: false,
          message: "Session has expired",
        };
      }

      const user = await User.findOne({ where: { userId } });

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      await Session.update({ isRevoked: true }, { where: { token, userId } });

      const accessToken = Tokens.access(user);
      const newRefreshToken = Tokens.refresh(userId);

      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

      const newSession = await Session.create({
        sessionId,
        userId,
        token: newRefreshToken,
        expiresAt,
        isRevoked: false,
      });

      if (!newSession) {
        return {
          success: false,
          message: "Failed to create new session",
        };
      }

      return {
        success: true,
        message: "Tokens refreshed successfully",
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error(`Error refreshing tokens: ${error}`);
      return {
        success: false,
        message: "An error occurred while refreshing tokens",
      };
    }
  }
}

export default RefreshService;
