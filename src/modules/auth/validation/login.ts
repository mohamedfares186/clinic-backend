import { body } from "express-validator";
import error from "./error.js";

const loginValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .isString(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isString(),
  error,
];

export default loginValidation;
