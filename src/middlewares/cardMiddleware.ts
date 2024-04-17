import { skip } from "graphql-resolvers";
import GenericHelper from "../utils/helpers/generic.helpers";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger";
import cardService from "../services/card/card.service";
import { EditCardSchema } from "../validations/card";

const { errorResponse } = GenericHelper;

export class CardMiddleware {
  
  static async cardExists(_: void, { card_id }: { data: EditCardSchema, card_id: number }) {
    try {
      const card = await cardService.fetchCardById(card_id);
      logger.info(`Card found - ${JSON.stringify(card)}`);
      if (!card) {
        return errorResponse(
          StatusCodes.BAD_REQUEST,
          `Card with id "${card_id}" does not exist`
        );
      }
      skip;
    } catch (error) {
      return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
