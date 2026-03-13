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
}

export default AccountController;
