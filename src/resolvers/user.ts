import { combineResolvers } from "graphql-resolvers";
import { registerUserSchema, RegisterUserSchema } from "../validations/user";
import middlewares from "../middlewares";
import controllers from "../controllers";

const {
  AuthMiddleware: { validatePasswords, validateRequests, isUniqueUser },
} = middlewares;
const {
  UserController: { registerUser, loginUser },
} = controllers;

const userResolvers = {
  Mutation: {
    registerUser: combineResolvers(
      validateRequests<RegisterUserSchema>(registerUserSchema),
      validatePasswords,
      isUniqueUser,
      registerUser
    ),
    login: combineResolvers(loginUser),
  },
};

export default userResolvers;
