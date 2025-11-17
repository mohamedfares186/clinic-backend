import { body } from "express-validator";
import error from "./error.js";

const registerValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isString(),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .isString(),
  body("email").notEmpty().withMessage("Email is required").trim().isEmail(),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage("Username must be between 4 and 30 characters")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage("Username may contain only letters, numbers and underscore"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isString()
    .isLength({ min: 8, max: 64 })
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
  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .trim()
    .isDate()
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 16) {
        throw new Error("You must be at least 16 years old to register");
      }

      if (age > 100) {
        throw new Error("Please enter a valid date of birth");
      }

      return true;
    }),
  error,
];

export default registerValidation;
