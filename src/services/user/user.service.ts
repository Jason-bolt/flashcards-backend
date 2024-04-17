import UserModel from "../../config/database/models/user";
import IUserService from "./user.Iservice";
import db from "../../config/database";
import logger from "../../config/logger";
import { userQueries } from "../../queries/user.queries";
import { LoginSchema, RegisterUserSchema } from "../../validations/user";
import { hashText } from "../../utils/helpers/hash.helpers";

class UserService implements IUserService {
  async getUser(username: string): Promise<UserModel> {
    try {
      logger.info(
        `***** User Service *****: Getting user info by username - ${username}`
      );
      const user = await db.oneOrNone(userQueries.getUser, [username]);
      logger.info(`User fetched - ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      logger.error(
        `An error occured when getting a user - ${JSON.stringify(error)}`
      );
      throw error;
    }
  }

  async registerUser(data: RegisterUserSchema): Promise<UserModel> {
    try {
      logger.info(
        `***** User Service *****: Registering user - ${JSON.stringify(data)}`
      );
      const hashedPassword = await hashText(data.password);
      const user = await db.one(userQueries.createUser, [
        data.username,
        hashedPassword,
      ]);
      logger.info(`User created - ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      logger.error(
        `An error occured when registering a user, user - ${JSON.stringify(
          error
        )}`
      );
      throw error;
    }
  }
}

const userService = new UserService();

export default userService;
