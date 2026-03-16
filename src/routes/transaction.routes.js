import express from "express";
import { authMiddleware } from "#middlewares";
import { TransactionController } from "#controllers";

const transactionRoutes = express.Router();

transactionRoutes
  .route("/")
  .post(authMiddleware, TransactionController.createTransaction);

export default transactionRoutes;
