import { cookie } from "express-validator";
import error from "./error.js";

const refreshValidation = [
  cookie("refreshToken")
    .exists()
    .withMessage("Unauthorized")
    .isString()
    .withMessage("Refresh token must be a string"),
  error,
];

export default refreshValidation;
