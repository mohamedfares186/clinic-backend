import { body, param } from "express-validator";
import error from "./error.js";

export const forgetPasswordValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email format"),
  error,
];

export const resetPasswordValidation = [
  param("token")
    .exists()
    .withMessage("Reset token is required")
    .isString()
    .withMessage("Reset token must be a string"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      "Password must include at least one letter, one number and one special character"
    ),
  body("repeatPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .trim()
    .isString()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  error,
];
