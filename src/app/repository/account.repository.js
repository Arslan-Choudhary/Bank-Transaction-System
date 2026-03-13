import { accountModel } from "#models";

class AccountRepository {
  static async createAccount(id) {
    return await accountModel.create({ user: id });
  }
}

export default AccountRepository;
