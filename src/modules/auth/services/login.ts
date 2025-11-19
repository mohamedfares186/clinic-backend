import { logger } from "../../../middleware/logger.js";
import type { LoginCredentials } from "../../../types/credentials.js";
import User from "../../users/models/users.js";
import type { UserCredentials } from "../../../types/credentials.js";
import bcrypt from "bcryptjs";
import Role from "../../users/models/roles.js";

interface LoginResult {
  success: boolean;
  message: string;
  user?: UserCredentials;
  role?: number;
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

      const userRole = await Role.findOne({
        where: { roleId: user.roleId },
      });

      if (!userRole)
        return {
          success: false,
          message: "Initial roles are not defined",
        };

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
        user: user,
        role: userRole.level,
      };
    } catch (error) {
      logger.error(`Error logging user in - ${error}`);
      return {
        success: false,
        message: "An error occurred during login",
      };
    }
  }
}

export default LoginService;
