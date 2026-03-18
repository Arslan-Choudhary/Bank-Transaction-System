import express from "express";
import { UserController } from "#controllers";

const userRouter = express.Router();

/* POST /api/auth/register */
userRouter.route("/register").post(UserController.userRegisterController);

/* POST /api/auth/login */
userRouter.route("/login").post(UserController.userLoginController);

/**
 * - POST /api/auth/logout
 */
userRouter.route("/logout").post(UserController.userLogoutController);

export default userRouter;
