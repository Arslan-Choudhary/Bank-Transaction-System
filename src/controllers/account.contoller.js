import { AccountServices } from "#service";
import { ResponseHandler } from "#utils";

class AccountController {
  static async createAccount(req, res) {
    try {
      const user = req.user;

      const account = await AccountServices.createAccount(user._id);

      ResponseHandler.createHandler(
        res,
        account,
        "account created successfully",
      );
    } catch (error) {
      ResponseHandler.errorHandler(res, error);
    }
  }

  static async getUserAccountsController(req, res) {
    try {
      const accounts = await AccountServices.getUserAccounts({
        userId: req.user._id,
      });

      

      ResponseHandler.createHandler(
        res,
        accounts,
        "account fetched successfully",
      );
    } catch (error) {
      ResponseHandler.errorHandler(res, error);
    }
  }

  static async getAccountBalanceController(req, res) {
    try {
      const { accountId } = req.params;
      const userId = req.user._id;
      const data = await AccountServices.getUserAccount(accountId, userId);
      ResponseHandler.successHandler(
        res,
        data,
        "balance fetched successfully",
      );
    } catch (error) {
      ResponseHandler.errorHandler(res, error);
    }
  }
}

export default AccountController;
