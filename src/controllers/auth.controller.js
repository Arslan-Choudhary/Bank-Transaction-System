import { UserServices } from "#service";
import { ResponseHandler, EmailServices } from "#utils";

class UserController {
  /**
   * - user register controller
   * - POST /api/auth/register
   */
  static async userRegisterController(req, res) {
    try {
      const { email, password, name } = req.body;

      const { user, token } = await UserServices.UserRegister(
        email,
        password,
        name,
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const responseData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        token: token,
      };

      ResponseHandler.createHandler(res, responseData);

      await EmailServices.sendRegistrationEmail(user.email, user.name);
    } catch (error) {
      ResponseHandler.errorHandler(res, error);
      //   return res.status(500).json({ error: error });
      // console.log(error)
    }
  }

  /**
   * - User LoginController
   * - POST /api/auth/login
   */
  static async userLoginController(req, res) {
    try {
      const { email, password } = req.body;

      const { token, user } = await UserServices.UserLogin(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const responseData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        token: token,
      };

      ResponseHandler.successHandler(
        res,
        responseData,
        "User Login Successfully",
      );
    } catch (error) {
      console.log(error);
      ResponseHandler.errorHandler(res, error);
    }
  }
}

export default UserController;
