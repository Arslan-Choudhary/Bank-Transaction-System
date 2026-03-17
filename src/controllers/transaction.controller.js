import { TransacrionService } from "#service";
import { EmailServices, ResponseHandler } from "#utils";

class TransactionController {
  static async createTransaction(req, res) {
    try {
      const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

      const { transaction, message } =
        await TransacrionService.createTransaction({
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
        });

      await EmailServices.sendTransactionEmail(
        req.user.email,
        req.user.name,
        amount,
        toAccount,
      );

      ResponseHandler.createHandler(res, transaction, message);
    } catch (error) {
      ResponseHandler.errorHandler(res, error);
    }
  }

  static async createInitialFundsTransaction(req, res) {
    try {
      const { toAccount, amount, idempotencyKey } = req.body;

      // const userId = req.user._id;

      const { transaction, message } =
        await TransacrionService.createInitialFundsTransaction({
          toAccount,
          amount,
          idempotencyKey,
          userId: req.user._id,
        });

      ResponseHandler.createHandler(res, transaction, message);
    } catch (error) {
      ResponseHandler.errorHandler(res, error);
    }
  }
}

export default TransactionController;
