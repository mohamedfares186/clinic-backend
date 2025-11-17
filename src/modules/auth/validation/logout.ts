import { cookie } from "express-validator";
import error from "./error.js";

const logoutValidation = [
  cookie("refresh-token")
    .exists()
    .withMessage("Unauthorized")
    .isString()
    .withMessage("Token must be a string."),
  error,
];

export default logoutValidation;
