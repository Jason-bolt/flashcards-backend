import GenericHelper from "../../utils/helpers/generic.helpers";
import logger from "../../config/logger";
import { StatusCodes } from "http-status-codes";
import {
  CreateCardSchema,
  SearchFilterCardSchema,
} from "../../validations/card";
import cardService from "../../services/card/card.service";
import UserModel from "../../config/database/models/user";

const { sendGraphQLResponse, errorResponse } = GenericHelper;

class CardController {
  static async createCard(
    _: any,
    { data }: { data: CreateCardSchema },
    { user }: { user?: Pick<UserModel, "id"> }
  ) {
    logger.info(
      `***** Card Contoller *****: Creating card with data - ${JSON.stringify(
        data
      )}, and user - ${JSON.stringify(user)}`
    );
    try {
      const card = await cardService.createCard(data, user.id);
      return sendGraphQLResponse(
        StatusCodes.CREATED,
        "Card created successfully!",
        card
      );
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  static async editCard(
    _: any,
    { data , card_id }: { data: CreateCardSchema, card_id: number }
  ) {
    logger.info(
      `***** Card Contoller *****: Editing card with data - ${JSON.stringify(
        data
      )}`
    );
    try {
      const card = await cardService.editCard(data, card_id);
      return sendGraphQLResponse(
        StatusCodes.OK,
        "Card edited successfully!",
        card
      );
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  static async deleteCard(_: any, { card_id }: { card_id: number }) {
    logger.info(`***** Card Contoller *****: Deleting card with id - ${card_id}`);
    try {
      const card = await cardService.deleteCard(card_id);
      return sendGraphQLResponse(
        StatusCodes.OK,
        "Card delete successfully!",
        card
      );
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  static async fetchUserCards(
    _: any,
    { data }: { data: SearchFilterCardSchema },
    { user }: { user?: Pick<UserModel, "id"> }
  ) {
    logger.info(
      `***** Card Contoller *****: Fetching user cards with data - ${JSON.stringify(
        data
      )}`
    );
    try {
      const cards = await cardService.fetchUserCards(data, user.id);
      return sendGraphQLResponse(
        StatusCodes.OK,
        "User cards fetched successfully!",
        cards
      );
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  static async answerCard(
    _: any,
    { isCorrect, card_id, bin }: { isCorrect: boolean; card_id: number, bin: number },
    { user }: { user?: Pick<UserModel, "id"> }
  ) {
    logger.info(
      `***** Card Contoller *****: Answering card with values - ${JSON.stringify(
        {
          isCorrect,
          card_id,
          bin
        }
      )}`
    );
    try {
      const cards = await cardService.answerCard(isCorrect, card_id, bin, user.id);
      return sendGraphQLResponse(
        StatusCodes.OK,
        "Card answered!",
        cards
      );
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  static async fetchDisplayCard(
    _: any,
    __: any,
    { user }: { user?: Pick<UserModel, "id"> }
  ) {
    logger.info(
      `***** Card Contoller *****: Fetching display card of user - ${JSON.stringify(
        user
      )}`
    );
    try {
      const card = await cardService.fetchDisplayCard(user.id);
      return sendGraphQLResponse(
        StatusCodes.OK,
        "Display card created successfully!",
        card
      );
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
  
  static async fetchCardById(
    _: any,
    { id }: { id: number },
  ) {
    logger.info(
      `***** Card Contoller *****: Fetching a card by id - ${id}`
    );
    try {
      const card = await cardService.fetchCardById(id);
      return sendGraphQLResponse(
        StatusCodes.OK,
        "Card fetched successfully!",
        card
      );
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
 
  // static async areCardsDone(
  //   _: any,
  //   __: any,
  //   { user }: { user?: Pick<UserModel, "id"> }
  // ) {
  //   logger.info(
  //     `***** Card Contoller *****: Checking if cards are done for user - ${JSON.stringify(user)}`
  //   );
  //   try {
  //     const areCardsDone = await cardService.areCardsDone(user.id);
  //     return areCardsDone;
  //   } catch (error) {
  //     return false;
  //   }
  // }
}

export default CardController;
