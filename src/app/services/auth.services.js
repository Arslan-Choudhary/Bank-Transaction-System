import { UserRepository } from "#repository";

class UserServices {
  static async UserRegister(email, password, name) {
    const isExists = await UserRepository.FindByEmail(email);

    if (isExists) {
      const error = new Error("User already exists");
      error.status = 409;
      throw error;
    }

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

  static async logoutUser(token) {
    if (!token) {
      const error = new Error("User already logged out");
      error.status = 400;
      throw error;
    }

    const blackListedToken = await UserRepository.logoutUser(token);

    return blackListedToken;
  }
}

export default UserServices;
