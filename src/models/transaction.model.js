import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a from account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a to account"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "FAILED", "COMPLETED", "REVERSED"],
        status: "Status can be either PENDING, FAILED, COMPLETED or REVERSED",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for creating a transaction"],
      min: [0, "Transaction amount cannot be negative"],
    },
    idempotencyKey: {
      type: String,
      required: [
        true,
        "Idempotency Key is required for creating a transaction",
      ],
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

const transactionModel = mongoose.model("Transaction", transactionSchema);

export default transactionModel;
