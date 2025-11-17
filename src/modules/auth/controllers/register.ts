import Tokens from "../../../utils/token.js";
import Session from "../../users/models/sessions.js";
import { logger } from "../../../middleware/logger.js";
import RegisterService from "../services/register.js";
import type { Request, Response } from "express";
import type { RegisterCredentials } from "../../../types/credentials.js";
import { v4 as uuidv4 } from "uuid";
import environment from "../../../config/env.js";

const { env } = environment;

class RegisterController {
  constructor(protected registerService = new RegisterService()) {
    this.registerService = registerService;
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { firstName, lastName, email, username, password, dateOfBirth } =
        req.body;

      const result = await this.registerService.register({
        firstName,
        lastName,
        email,
        username,
        password,
        dateOfBirth,
      } as RegisterCredentials);

      if (!result.success || !result.user) {
        const statusCode = result.message.includes("already exists")
          ? 409
          : 400;
        return res.status(statusCode).json({
          success: false,
          message: result.message,
        });
      }

      const accessToken = Tokens.access(result.user);
      const refreshToken = Tokens.refresh(result.user.userId);

      try {
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        await Session.create({
          sessionId,
          userId: result.user.userId,
          token: refreshToken,
          expiresAt,
          isRevoked: false,
        });
      } catch (sessionError) {
        logger.error(`Failed to create session for new user: ${sessionError}`);
      }

      res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: env === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });

      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: env === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        emailSent: result.emailSent,
      });
    } catch (error) {
      logger.error(`Error in register controller: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default RegisterController;
