import sendEmail from "../../../utils/email.js";
import Tokens from "../../../utils/token.js";
import env from "../../../config/env.js";
import User from "../../users/models/users.js";
import type { UUIDTypes } from "uuid";
import { logger } from "../../../middleware/logger.js";

const { secureSecret } = env;

interface EmailVerificationResult {
  success: boolean;
  message: string;
}

class EmailService {
  async send(
    userId: UUIDTypes,
    email: string
  ): Promise<EmailVerificationResult> {
    try {
      const token = Tokens.secure(userId as string, secureSecret as string);
      const link = `http://localhost:5000/api/auth/email/verify/${token}`;

      await sendEmail(
        email,
        "Verify your Email",
        `Click this link to verify your email: ${link}`
      );

      return {
        success: true,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      logger.error(`Error sending verification email - ${error}`);
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }
  }

  async verify(token: string): Promise<EmailVerificationResult> {
    try {
      const userId = Tokens.validate(token, secureSecret as string, 36000000);

      if (!userId) {
        return {
          success: false,
          message: "Invalid or expired token",
        };
      }

      const user = await User.findOne({ where: { userId } });

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      if (user.isVerified === true) {
        return {
          success: false,
          message: "Email is already verified",
        };
      }

      user.isVerified = true;
      await user.save();

      return {
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      logger.error(`Error verifying user email - ${error}`);
      return {
        success: false,
        message: "An error occurred during email verification",
      };
    }
  }

  async resend(userId: UUIDTypes): Promise<EmailVerificationResult> {
    try {
      const user = await User.findOne({ where: { userId } });

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      if (user.isVerified) {
        return {
          success: false,
          message: "Email is already verified",
        };
      }

      return await this.send(userId, user.email);
    } catch (error) {
      logger.error(`Error resending verification email - ${error}`);
      return {
        success: false,
        message: "Failed to resend verification email",
      };
    }
  }
}

export default EmailService;
