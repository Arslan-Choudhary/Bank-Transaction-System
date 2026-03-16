import express from "express";
import { authMiddleware, authSystemUserMiddleware } from "#middlewares";
import { TransactionController } from "#controllers";

const transactionRoutes = express.Router();

/**
 * - POST /api/transaction
 * - Create a new transaction
 */
transactionRoutes
  .route("/")
  .post(authMiddleware, TransactionController.createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRoutes
  .route("/system/initial-funds")
  .post(
    authSystemUserMiddleware,
    TransactionController.createInitialFundsTransaction,
  );

export default transactionRoutes;
