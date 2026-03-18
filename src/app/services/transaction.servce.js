import mongoose from "mongoose";
import { TransactionRepository, LedgerRepository } from "#repository";
// import { EmailServices } from "#utils";

class TransacrionService {
  static async createTransaction({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
  }) {
    /**
     * 1. validate request
     */

    // const { fromAccount, toAccount, amount, idempotencyKey } = data;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      const error = new Error(
        "FromAccount, toAccount, amount and idempotencyKey are required",
      );
      error.status = 400;
      throw error;
    }

    const fromUserAccount =
      await TransactionRepository.findAccountById(fromAccount);

    const toUserAccount =
      await TransactionRepository.findAccountById(toAccount);

    if (!fromUserAccount || !toUserAccount) {
      const error = new Error("Invalid FromAccount or toAccount");
      error.status = 400;
      throw error;
    }

    /**
     * 2. validate idempotency key
     */
    const isTransactionAlreadyExists =
      await TransactionRepository.findTransactionByIdempotencyKey(
        idempotencyKey,
      );

    if (isTransactionAlreadyExists) {
      if (isTransactionAlreadyExists.status === "COMPLETED") {
        return {
          transaction: isTransactionAlreadyExists,
          message: "Transaction Already Proceeded",
        };
      }

      if (isTransactionAlreadyExists.status === "PENDING") {
        const error = new Error("Transaction is still in processing");
        error.status = 200;
        throw error;
      }

      if (isTransactionAlreadyExists.status === "FAILED") {
        const error = new Error("Transaction processing failed, please retry");
        error.status = 500;
        throw error;
      }

      if (isTransactionAlreadyExists.status === "REVERSED") {
        const error = new Error("Transaction was reversed, please retry");
        error.status = 500;
        throw error;
      }
    }

    /**
     * 3. check account status
     */
    if (
      fromUserAccount.status !== "ACTIVE" ||
      toUserAccount.status !== "ACTIVE"
    ) {
      const error = new Error(
        "Both fromAccount and toAccount must be ACTIVE to process transaction",
      );
      error.status = 400;
      throw error;
    }

    /**
     * 4. Derive sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
      const error = new Error(
        `Insufficient balance, Current balance is ${balance}. Requested amount is ${amount}`,
      );
      error.status = 400;
      throw error;
    }

    let transaction;
    try {
      /**
       * 5. Create transaction (PENDING)
       */
      const session = await mongoose.startSession();
      session.startTransaction();

      transaction = await TransactionRepository.createTransaction(
        {
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
        session,
      );

      const debitLedgerEntry = await LedgerRepository.createLedger(
        {
          account: fromAccount,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
        session,
      );

      await (() => {
        return new Promise((resolve) => setTimeout(resolve, 10 * 1000));
      })();

      const creditLedgerEntry = await LedgerRepository.createLedger(
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
        session,
      );

      transaction.status = "COMPLETED";

      await transaction.save({ session });

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      const error = new Error(
        "Transaction is Pending due to some issue, please retry after sometime",
      );
      error.status = 400;
      throw error;
    }

    return { transaction, message: "Transaction completed successfully" };

    /**
     * 6. Send email notification
     */
    //  await EmailServices.sendTransactionEmail(req.user.email)
  }

  static async createInitialFundsTransaction({
    toAccount,
    amount,
    idempotencyKey,
    userId,
  }) {
    if (!toAccount || !amount || !idempotencyKey) {
      const error = new Error(
        "toAccount, amount and idempotencyKey are required",
      );
      error.status = 400;
      throw error;
    }

    const toUserAccount =
      await TransactionRepository.findAccountById(toAccount);

    if (!toUserAccount) {
      const error = new Error("Invalid toAccount");
      error.status = 400;
      throw error;
    }

    const fromUserAccount =
      await TransactionRepository.findSystemUserAccount(userId);

    if (!fromUserAccount) {
      const error = new Error("System user account not found");
      error.status = 400;
      throw error;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await TransactionRepository.createTransaction(
      {
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
      },
      session,
    );

    const debitLedgerEntry = await LedgerRepository.createLedger(
      {
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
      session,
    );

    const creditLedgerEntry = await LedgerRepository.createLedger(
      {
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
      session,
    );

    transaction.status = "COMPLETED";

    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      transaction,
      message: "Initial funds transaction completed successfully",
    };
  }
}

export default TransacrionService;
