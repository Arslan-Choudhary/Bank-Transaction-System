import express from "express";
import { authMiddleware, Validation } from "#middlewares";
import { AccountController } from "#controllers";
import { SchemaValidation } from "#utils";

const accountRouter = express.Router();

/**
 * - POST /api/accounts
 * - create a new account
 * - protected route
 */

accountRouter
  .route("/")
  .post(
    authMiddleware,
    Validation.validateRegister(SchemaValidation.createAccountSchema),
    AccountController.createAccount,
  );

/**
 * - GET /api/accounts
 * - Get all accounts of the logged-in user
 * - Protected Route
 */

accountRouter
  .route("/")
  .get(authMiddleware, AccountController.getUserAccountsController);

/**
 * - GET /api/accounts/balance/:accountId
 */

accountRouter
  .route("/balance/:accountId")
  .get(authMiddleware, AccountController.getAccountBalanceController);

export default accountRouter;
