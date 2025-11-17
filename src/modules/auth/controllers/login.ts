import type { Request, Response } from "express";
import LoginService from "../services/login.js";
import Tokens from "../../../utils/token.js";
import Session from "../../users/models/sessions.js";
import environment from "../../../config/env.js";
import { logger } from "../../../middleware/logger.js";
import { v4 as uuidv4 } from "uuid";

const { env } = environment;

class LoginController {
  constructor(protected loginService = new LoginService()) {
    this.loginService = loginService;
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, password } = req.body;

      const result = await this.loginService.login({ username, password });

      if (
        !result.success ||
        !result.user ||
        !result.user.userId ||
        !result.user.roleId ||
        result.user.isVerified === undefined
      ) {
        return res.status(401).json({
          success: false,
          message: result.message,
        });
      }

      const { userId, roleId, isVerified } = result.user;

      const accessToken = Tokens.access({
        userId,
        roleId,
        isVerified,
        level: 1234,
      });
      const refreshToken = Tokens.refresh(result.user.userId);

      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

      await Session.create({
        sessionId,
        userId: result.user.userId,
        token: refreshToken,
        expiresAt,
        isRevoked: false,
      });

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

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
      });
    } catch (error) {
      logger.error(`Error logging user in - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default LoginController;
