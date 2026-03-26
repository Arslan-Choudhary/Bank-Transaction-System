import express from "express";
import { UserController } from "#controllers";
import { Validation } from "#middlewares";
import { SchemaValidation } from "#utils";

const userRouter = express.Router();

/* POST /api/auth/register */
userRouter
  .route("/register")
  .post(
    Validation.validateRegister(SchemaValidation.userRegisterSchema),
    UserController.userRegisterController,
  );

/* POST /api/auth/login */
userRouter
  .route("/login")
  .post(
    Validation.validateRegister(SchemaValidation.userLoginSchema),
    UserController.userLoginController,
  );

/**
 * - POST /api/auth/logout
 */
userRouter.route("/logout").post(UserController.userLogoutController);

export default userRouter;
