import express from "express";
import type { RequestHandler, ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import requestLogger from "./middleware/logger.js";
import error from "./middleware/error.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(requestLogger as RequestHandler);

app.use(error as ErrorRequestHandler);

export default app;
