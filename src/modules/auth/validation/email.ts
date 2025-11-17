import { param } from "express-validator";
import error from "./error.js";

const emailVerificationValidation = [
  param("token")
    .exists()
    .withMessage("Verification token is required")
    .isString()
    .withMessage("Verification token must be a string"),
  error,
];

export default emailVerificationValidation;
