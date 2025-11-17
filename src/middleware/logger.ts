import type { NextFunction } from "express";
import { createLogger, format, transports } from "winston";
import type { UserRequest, UserResponse } from "../types/request.js";
import type { UUIDTypes } from "uuid";

const { combine, timestamp, json, colorize, printf } = format;

const jsonFormat = combine(timestamp(), json());

export const logger = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console({
      level: "debug",
      format: combine(
        colorize(),
        timestamp(),
        printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    }),
    new transports.File({
      filename: "logs/info.log",
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
      format: jsonFormat,
    }),
    new transports.File({
      filename: "logs/warn.log",
      level: "warn",
      maxsize: 5242880,
      maxFiles: 5,
      format: jsonFormat,
    }),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
      format: jsonFormat,
    }),
  ],
});

const requestLogger = (
  req: UserRequest,
  res: UserResponse,
  next: NextFunction
) => {
  const { method, url, hostname, headers, ip } = req;
  const userId: UUIDTypes | string = req.user?.userId || "Anonymous";
  const role: UUIDTypes | string = req.user?.roleId || "Guest";
  const time = Date.now();

  logger.info(`${method} Request to ${hostname}${url}`);

  res.on("finish", () => {
    const duration = Date.now() - time;
    const statusCode: number = res.statusCode;
    const { message } = res;

    const response = {
      userId,
      role,
      time: time,
      message: message,
      url: url,
      method: method,
      statusCode: statusCode,
      hostname: hostname,
      duration: duration,
      ip: ip,
      headers: headers,
    };

    if (statusCode >= 500) {
      logger.error(`Server Error: ${response}`);
    } else if (statusCode >= 400) {
      if (statusCode === 401 || statusCode === 403) {
        logger.warn(`[SECURITY] Unauthorized/Forbidden Access: ${response}`);
      } else {
        logger.warn(`Client Error: ${response}`);
      }
    } else {
      logger.info(`Response Information: ${response}`);
    }
  });
  return next();
};

export default requestLogger;
