import express from "express";
import {
  authMiddleware,
  authSystemUserMiddleware,
  Validation,
} from "#middlewares";
import { TransactionController } from "#controllers";
import { SchemaValidation } from "#utils";

const transactionRoutes = express.Router();

/**
 * - POST /api/transaction
 * - Create a new transaction
 */
transactionRoutes
  .route("/")
  .post(
    authMiddleware,
    Validation.validateRegister(SchemaValidation.createTransactionSchema),
    TransactionController.createTransaction,
  );

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRoutes
  .route("/system/initial-funds")
  .post(
    authSystemUserMiddleware,
    Validation.validateRegister(
      SchemaValidation.createInitialFundsTransactionSchema,
    ),
    TransactionController.createInitialFundsTransaction,
  );

export default transactionRoutes;
