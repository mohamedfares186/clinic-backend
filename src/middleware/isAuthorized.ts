import type { NextFunction, Response } from "express";
import type { UserRequest } from "../types/request.js";
import { logger } from "./logger.js";

const authorize =
  (...allowedRoles: number[]) =>
  (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const role = req.user?.level;
      if (!allowedRoles.includes(role)) {
        logger.warn("Role access denied:", {
          userId: req.user?.userId,
          roleId: req.user?.roleId,
          roleLevel: req.user?.level,
          requiredRoles: allowedRoles,
          userAgent: req.headers["user-agent"],
          ip: req.ip,
        });
        return res.status(403).json({ error: "Forbidden" });
      }

      return next();
    } catch (error) {
      logger.warn("Authorization error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

export default authorize;
