import { Router } from "express";
import RegisterController from "../controllers/register.js";
import LoginController from "../controllers/login.js";
import LogoutController from "../controllers/logout.js";
import RefreshController from "../controllers/refresh.js";
import EmailController from "../controllers/email.js";
import PasswordController from "../controllers/password.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import registerValidation from "../validation/register.js";
import loginValidation from "../validation/login.js";
import logoutValidation from "../validation/logout.js";
import refreshValidation from "../validation/refresh.js";
import emailVerificationValidation from "../validation/email.js";
import {
  forgetPasswordValidation,
  resetPasswordValidation,
} from "../validation/password.js";

const router = Router();

const email = new EmailController();
const password = new PasswordController();

router.post("/register", registerValidation, new RegisterController().register);
router.post("/login", loginValidation, new LoginController().login);
router.post(
  "/logout",
  logoutValidation,
  authenticate,
  new LogoutController().logout
);
router.post(
  "/refresh",
  refreshValidation,
  authenticate,
  new RefreshController().refresh
);
router.post("/email/resend", authenticate, email.resend);
router.post("/email/verify/:token", emailVerificationValidation, email.verify);
router.post("/password/forget", forgetPasswordValidation, password.forget);
router.post("/password/reset/:token", resetPasswordValidation, password.reset);

export default router;
