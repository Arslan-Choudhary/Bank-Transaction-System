import { userModel } from "#models";

class UserRepository {
  static async FindByEmail(email) {
    return await userModel.findOne({ email });
  }

  static async FindByEmailWithPassword(email) {
    return await userModel.findOne({ email }).select("+password");
  }

  static async FindUserById(id, select = "") {
    return await userModel.findById(id).select(select);
  }

  static async createUser(data) {
    return await userModel.create(data);
  }
}

export default UserRepository;
