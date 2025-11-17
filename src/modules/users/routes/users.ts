import { Router } from "express";
import CreateUserController from "../controllers/createUser.js";
import isAuthorized from "../../../middleware/isAuthorized.js";

const router = Router();

router.post(
  "/create",
  isAuthorized(9999),
  new CreateUserController().createUser
);

export default router;
