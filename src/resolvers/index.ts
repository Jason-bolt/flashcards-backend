import { resolvers as scalarResolvers } from "graphql-scalars";
import userResolvers from "./user";
import cardResolvers from "./card";


export default [scalarResolvers, userResolvers, cardResolvers];
