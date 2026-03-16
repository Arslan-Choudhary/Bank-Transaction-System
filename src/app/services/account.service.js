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
}

export default AccountServices;
