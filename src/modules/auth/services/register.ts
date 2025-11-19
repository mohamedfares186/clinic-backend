import { logger } from "../../../middleware/logger.js";
import { v4 as uuidv4, type UUIDTypes } from "uuid";
import bcrypt from "bcryptjs";
import type { UserCredentials } from "../../../types/credentials.js";
import User from "../../users/models/users.js";
import type { RegisterCredentials } from "../../../types/credentials.js";
import Tokens from "../../../utils/token.js";
import sendEmail from "../../../utils/email.js";
import { Op } from "sequelize";
import Role from "../../users/models/roles.js";
import environment from "../../../config/env.js";

const { frontendUrl, secureSecret } = environment;

interface RegisterResult {
  success: boolean;
  message: string;
  user?: UserCredentials;
  level?: number;
  emailSent?: boolean;
}

class RegisterService {
  async register(credentials: RegisterCredentials): Promise<RegisterResult> {
    try {
      const { firstName, lastName, email, username, password, dateOfBirth } =
        credentials;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !username ||
        !password ||
        !dateOfBirth
      ) {
        return {
          success: false,
          message: "All fields are required",
        };
      }

      if (password.length < 8) {
        return {
          success: false,
          message: "Password must be at least 8 characters long",
        };
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return {
          success: false,
          message: "Email or username unavailable",
        };
      }

      const role = await Role.findOne({ where: { level: 1234 } });

      if (!role) {
        logger.error("Default role not found in database");
        return {
          success: false,
          message: "System configuration error. Please contact support.",
        };
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const userId: UUIDTypes = uuidv4();

      const newUser = await User.create({
        userId,
        firstName,
        lastName,
        email,
        username,
        password: passwordHash,
        roleId: role.roleId,
        dateOfBirth,
        isVerified: false,
      });

      if (!newUser) {
        return {
          success: false,
          message: "Failed to create user account",
        };
      }

      let emailSent = false;
      try {
        const token = Tokens.secure(userId as string, secureSecret as string);
        const link = `${frontendUrl}/api/v1/auth/email/verify/${token}`;

        await sendEmail(
          newUser.email,
          "Verify your Email",
          `Click this link to verify your email: ${link}`
        );
        emailSent = true;
      } catch (emailError) {
        logger.error(
          `Failed to send verification email to ${email}: ${emailError}`
        );
      }

      return {
        success: true,
        message: emailSent
          ? "Registration successful. Please check your email to verify your account."
          : "Registration successful, but we couldn't send the verification email. Please request a new one.",
        user: newUser,
        emailSent,
      };
    } catch (error) {
      logger.error(`Error during user registration - ${error}`);
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  }
}

export default RegisterService;
