import GenericHelper from "../../utils/helpers/generic.helpers";
import userService from "../../services/user/user.service";
import { LoginSchema, RegisterUserSchema } from "../../validations/user";
import logger from "../../config/logger";
import { StatusCodes } from "http-status-codes";
import {
  comparePasswords,
} from "../../utils/helpers/hash.helpers";
import { generateJwt } from "../../utils/helpers/auth.helpers";

const { sendGraphQLResponse, errorResponse } = GenericHelper;

class UserController {
  static async registerUser(_: any, { data }: { data: RegisterUserSchema }) {
    logger.info(
      `***** User Controller *****: Creating user with data - ${JSON.stringify(data)}`
    );
    try {
      const { password, ...user } = await userService.registerUser(data);
      logger.info(`Created user - ${JSON.stringify(user)}`);
      return sendGraphQLResponse(
        StatusCodes.CREATED,
        "User created successfully!",
        user
      );
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  static async loginUser(_: any, { data }: { data: LoginSchema }) {
    logger.info(
      `***** User Controller *****: Logging user in with data - ${JSON.stringify(data)}`
    );
    try {
      const user = await userService.getUser(data.username);
      if (!user) {
        logger.info(`No user with username - ${data.username} exists`);
        return errorResponse(
          StatusCodes.BAD_REQUEST,
          "Username or password is invalid!"
        );
      }
      const passwordMatch = await comparePasswords(
        data.password,
        user.password
      );
      if (!passwordMatch) {
        logger.info(`No user with username - ${data.username} exists`);
        return errorResponse(
          StatusCodes.BAD_REQUEST,
          "Username or password is invalid!"
        );
      }
      const { id, username } = user;
      const token: string = generateJwt({
        id,
        username,
      });
      logger.info(`Token generated - ${token}`);
      return sendGraphQLResponse(
        StatusCodes.OK,
        "User logged in successfully!",
        { token }
      );
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}

export default UserController;
