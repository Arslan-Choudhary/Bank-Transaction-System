import { AccountRepository } from "#repository";

class AccountServices {
  static async createAccount(id) {
    const account = await AccountRepository.createAccount(id);

    return account;
  }
}

export default AccountServices;
