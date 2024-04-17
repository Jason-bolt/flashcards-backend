import { skip } from "graphql-resolvers";
import GenericHelper from "../utils/helpers/generic.helpers";
import { AnyZodObject } from "zod";
import { checkPasswords } from "../utils/helpers/hash.helpers";
import { RegisterUserSchema } from "../validations/user";
import userService from "../services/user/user.service";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger";

const { errorResponse } = GenericHelper;

export class AuthMiddleware {
  static validateRequests<T>(schema: AnyZodObject) {
    return (_: any, { data }: { data: T }) => {
      schema
        .parseAsync(data)
        .then(() => {
          skip;
        })
        .catch((error: any) => {
          errorResponse(StatusCodes.FORBIDDEN, error);
        });
    };
  }

  static validatePasswords(_: void, { data }: { data: RegisterUserSchema }) {
    const { password, passwordConfirmation } = data;
    const isValidPassword = checkPasswords(password, passwordConfirmation);
    if (!isValidPassword) {
      return errorResponse(StatusCodes.BAD_REQUEST, "Password is invalid!");
    }
    skip;
  }

  static async isUniqueUser(_: void, { data }: { data: RegisterUserSchema }) {
    try {
      const user = await userService.getUser(data.username);
      logger.info(`Checking if user was found - ${JSON.stringify(user)}`);
      if (user) {
        return errorResponse(
          StatusCodes.CONFLICT,
          "User with this username already exists"
        );
      }
      skip;
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
  
  static async userExists(_: void, { data }: { data: RegisterUserSchema }) {
    try {
      const user = await userService.getUser(data.username);
      logger.info(`User found - ${JSON.stringify(user)}`);
      if (!user) {
        return errorResponse(
          StatusCodes.BAD_REQUEST,
          "User with this username does not exist"
        );
      }
      skip;
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
