import express from "express";
import { authMiddleware } from "#middlewares";
import { AccountController } from "#controllers";

const accountRouter = express.Router();

/**
 * - POST /api/accounts
 * - create a new account
 * - protected route
 */

accountRouter.route("/").post(authMiddleware, AccountController.createAccount);

export default accountRouter;
