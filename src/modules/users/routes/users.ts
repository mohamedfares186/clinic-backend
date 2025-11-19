import { Router } from "express";
import CreateUserController from "../controllers/createUser.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import isAuthorized from "../../../middleware/isAuthorized.js";
import ReadAllUsersController from "../controllers/readAllUsers.js";
import UpdateUserController from "../controllers/updateUser.js";
import ReadOneUserController from "../controllers/readOneUser.js";

const router = Router();

router.get(
  "/",
  authenticate,
  isAuthorized(9999),
  new ReadAllUsersController().readUsers
);
router.post(
  "/create",
  authenticate,
  isAuthorized(9999),
  new CreateUserController().createUser
);
router.post(
  "/update/:userId",
  authenticate,
  isAuthorized(9999),
  new UpdateUserController().updateUser
);
router.post(
  "/:userId",
  authenticate,
  isAuthorized(9999),
  new ReadOneUserController().readUser
);

export default router;
