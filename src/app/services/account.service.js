import { AccountRepository } from "#repository";

class AccountServices {
  static async createAccount(id) {
    const existingAccount = await AccountRepository.findAccountByUserId(id);

    if (existingAccount) {
      const error = new Error("Account already exists for this user");
      error.status = 400;
      throw error;
    }

    const account = await AccountRepository.createAccount(id);

    return account;
  }

  static async getUserAccounts({ userId }) {
    const accounts = await AccountRepository.getUserAccounts(userId);
    return accounts;
  }

  static async getUserAccount(accountId, userId) {
    const account = await AccountRepository.getUserAccount(accountId, userId);

    if (!account) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    const balance = await account.getBalance();

    return { accountId: account._id, balance: balance };
  }
}

export default AccountServices;
