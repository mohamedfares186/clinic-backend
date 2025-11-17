import { logger } from "../../../middleware/logger.js";
import type { UserCredentials } from "../../../types/credentials.js";
import User from "../models/users.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import Role from "../models/roles.js";

interface CreateUserResponse {
  success: boolean;
  message: string;
}

class CreateUserService {
  async create(user: UserCredentials): Promise<CreateUserResponse> {
    try {
      const {
        roleTitle,
        firstName,
        lastName,
        email,
        username,
        password,
        dateOfBirth,
      } = user;

      if (
        !roleTitle ||
        !firstName ||
        !lastName ||
        !email ||
        !username ||
        !password ||
        !dateOfBirth
      )
        return {
          success: false,
          message: "All fields are required",
        };

      if (password.length < 8)
        return {
          success: false,
          message: "Password can't be less than 8 characters",
        };

      const role = await Role.findOne({
        where: { title: roleTitle },
      });

      if (!role)
        return {
          success: false,
          message: "Initial roles are not defined",
        };

      const userId = uuidv4();
      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        userId,
        roleId: role.roleId,
        firstName,
        lastName,
        email,
        username,
        password: passwordHash,
        dateOfBirth,
        isVerified: true,
      });

      if (!newUser)
        return {
          success: false,
          message: "Failed to create new user",
        };

      return {
        success: true,
        message: "User has been created successfully",
      };
    } catch (error) {
      logger.error(`Error creating user - ${error}`);
      return {
        success: false,
        message: "Something went wrong, please try again later",
      };
    }
  }
}

export default CreateUserService;
