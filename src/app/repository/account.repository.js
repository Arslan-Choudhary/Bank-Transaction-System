import { accountModel } from "#models";

class AccountRepository {
  static async findAccountByUserId(id) {
    return await accountModel.findOne({ user: id });
  }

  static async createAccount(id) {
    return await accountModel.create({ user: id });
  }

  static async getUserAccounts(userId) {
    return await accountModel.find({ user: userId });
  }
}

export default AccountRepository;
