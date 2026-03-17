import { accountModel, transactionModel } from "#models";

class TransactionRepository {
  static async findAccountById(accountId) {
    return await accountModel.findOne({ _id: accountId });
  }

  static async findSystemUserAccount(userId) {
    return await accountModel.findOne({ user: userId });
  }

  static async findTransactionByIdempotencyKey(IdempontencyKey) {
    return await transactionModel.findOne({ idempotencyKey: IdempontencyKey });
  }

  static async createTransaction(data, session) {
    const [transaction] = await transactionModel.create([data], { session });
    return transaction;
  }
}

export default TransactionRepository;
