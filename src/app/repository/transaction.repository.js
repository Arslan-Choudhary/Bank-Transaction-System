import { accountModel, transactionModel } from "#models";

class TransactionRepository {
  static async findAccountById(accountId) {
    return await accountModel.findOne({ _id: accountId });
  }

  static async findTransactionByIdempotencyKey(IdempontencyKey) {
    return await transactionModel.findOne({ idempotencyKey: IdempontencyKey });
  }

  static async createTransaction(data, session) {
    return await transactionModel.create(data, { session });
  }
}

export default TransactionRepository;
