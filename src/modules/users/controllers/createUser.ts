import type { Response } from "express";
import CreateUserService from "../services/createUser.js";
import type { UserRequest } from "../../../types/request.js";
import { logger } from "../../../middleware/logger.js";

class CreateUserController {
  constructor(protected user = new CreateUserService()) {
    this.user = user;
  }

  createUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const {
        roleTitle,
        firstName,
        lastName,
        email,
        username,
        password,
        repeatPassword,
        dateOfBirth,
      } = req.body;

      if (
        !roleTitle ||
        !firstName ||
        !lastName ||
        !email ||
        !username ||
        !password ||
        !repeatPassword ||
        !dateOfBirth
      )
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });

      if (password !== repeatPassword)
        return res.status(400).json({
          success: false,
          message: "Passwords don't match",
        });

      const newUser = await this.user.create({
        roleTitle,
        firstName,
        lastName,
        email,
        username,
        password,
        dateOfBirth,
      });

      if (!newUser)
        return res.status(500).json({
          success: false,
          message: "Failed to create new user",
        });

      return res.status(201).json({
        success: true,
        message: "User has been created successfully",
      });
    } catch (error) {
      logger.error(`Error creating new user - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
}

export default CreateUserController;
