import { logger } from "../../../middleware/logger.js";
import type { LoginCredentials } from "../../../types/credentials.js";
import User from "../../users/models/users.js";
import bcrypt from "bcryptjs";

interface LoginResult {
  success: boolean;
  message: string;
  user?: User;
}

class LoginService {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const { username, password } = credentials;

      if (!username || !password) {
        return {
          success: false,
          message: "Username and password are required",
        };
      }

      const user = await User.findOne({
        where: { username },
        attributes: { include: ["password"] },
      });

      if (!user) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      return {
        success: true,
        message: "Login successful",
        user,
      };
    } catch (error) {
      logger.error(`Error logging user in: ${error}`);
      return {
        success: false,
        message: "An error occurred during login",
      };
    }
  }
}

export default LoginService;
