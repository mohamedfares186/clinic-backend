import { logger } from "./logger.js";
import type { UserRequest, ResponseError } from "../types/request.js";
import type { NextFunction, Response } from "express";
import environment from "../config/env.js";

const { env } = environment;

const sendErrorDev = (err: ResponseError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: ResponseError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const error = (
  err: ResponseError,
  req: UserRequest,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction
) => {
  const userId = req.user?.userId || "Anonymous";
  const role = req.user?.roleId || "Guest";
  const { message, stack, statusCode, status } = err;
  const { method, url, hostname } = req;
  const time = Date.now();

  const response = {
    userId,
    role,
    time: time,
    message: message,
    url: url,
    method: method,
    statusCode: statusCode,
    hostname: hostname,
    errorStatus: status,
    stack,
  };

  if (statusCode >= 500) {
    logger.error(`Server Error: ${response}`);
  }

  if (statusCode >= 400) {
    logger.warn(`Client Error: ${response}`);
  }

  if (env === "production") {
    sendErrorProd(err, res);
  }

  return sendErrorDev(err, res);
};

export default error;
