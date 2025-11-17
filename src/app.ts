import express from "express";
import type { RequestHandler, ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import requestLogger from "./middleware/logger.js";
import error from "./middleware/error.js";
import limiter from "./middleware/limiter.js";
import auth from "./modules/auth/routes/auth.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(requestLogger as RequestHandler);
app.use(limiter as RequestHandler);

app.use("/api/v1/auth", auth);

app.use(error as ErrorRequestHandler);

export default app;
