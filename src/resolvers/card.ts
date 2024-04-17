import { combineResolvers } from "graphql-resolvers";
import middlewares from "../middlewares";
import {
  createCardSchema,
  CreateCardSchema,
  editCardSchema,
  EditCardSchema,
  searchFilterCardSchema,
  SearchFilterCardSchema,
} from "../validations/card";
import CardController from "../controllers/card";

const {
  AuthMiddleware: { validateRequests },
  CardMiddleware: { cardExists },
} = middlewares;

const {
  createCard,
  fetchDisplayCard,
  editCard,
  deleteCard,
  fetchUserCards,
  answerCard,
  fetchCardById,
  // areCardsDone,
} = CardController;

const cardResolvers = {
  Mutation: {
    createCard: combineResolvers(
      validateRequests<CreateCardSchema>(createCardSchema),
      createCard
    ),
    editCard: combineResolvers(
      cardExists,
      editCard
    ),
    deleteCard: combineResolvers(deleteCard),
    answerCard: combineResolvers(answerCard),
    // areCardsDone: areCardsDone,
  },
  Query: {
    fetchDisplayCard: combineResolvers(fetchDisplayCard),
    fetchUserCards: combineResolvers(
      validateRequests<SearchFilterCardSchema>(searchFilterCardSchema),
      fetchUserCards
    ),
    fetchCardById: combineResolvers(fetchCardById),
  },
};

export default cardResolvers;
