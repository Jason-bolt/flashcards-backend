import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import root from "./root";
import userSchema from "./user";
import cardSchema from "./card";

export default [root, ...scalarTypeDefs, userSchema, cardSchema];
