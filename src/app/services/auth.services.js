import { userModel } from "#models";
import { UserRepository } from "#repository";

class UserServices {
  static async UserRegister(email, password, name) {
    // const isExists = await userModel.findOne({ email });
    const isExists = await UserRepository.FindByEmail(email);

    if (isExists) {
      const error = new Error("User already exists");
      error.status = 409;
      throw error;
    }

    // const user = await userModel.create({ email, password, name });
    const user = await UserRepository.createUser({ email, password, name });

    const token = user.generateToken();

    return { user, token };
  }

  static async UserLogin(email, password) {
    const user = await UserRepository.FindByEmailWithPassword(email);

    if (!user) {
      const error = new Error("Email or Passwrod is INVALID");
      error.status = 401;
      throw error;
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      const error = new Error("Email or Passwrod is INVALID");
      error.status = 401;
      throw error;
    }

    const token = user.generateToken();

    return { user, token };
  }
}

export default UserServices;
