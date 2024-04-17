import db from "../../config/database";
import CardModel, { DisplayCardModel } from "../../config/database/models/card";
import logger from "../../config/logger";
import { cardQueries } from "../../queries/card.queries";
import { BinEnum, BinTimeEnum } from "../../utils/enums";
import {
  CreateCardSchema,
  EditCardSchema,
  SearchFilterCardSchema,
} from "../../validations/card";
import ICardService from "./card.Iservice";

class CardService implements ICardService {
  async createCard(
    data: CreateCardSchema,
    user_id: number
  ): Promise<CardModel> {
    try {
      logger.info(
        `***** Card Service *****: Creating card with data - ${JSON.stringify(
          data
        )} and user - ${JSON.stringify(user_id)}`
      );
      const card = await db.one(cardQueries.createCard, [
        data.word,
        data.definition,
        user_id,
      ]);
      logger.info(`Card created - ${JSON.stringify(card)}`);
      return card;
    } catch (error) {
      logger.error(
        `An error occured when creating a card - ${JSON.stringify(error)}`
      );
      throw error;
    }
  }

  async editCard(data: EditCardSchema, card_id: number): Promise<CardModel> {
    try {
      logger.info(
        `***** Card Service *****: Editing card with data - ${JSON.stringify(
          data
        )}`
      );
      const card = await db.one(cardQueries.editCard, [
        data.word,
        data.definition,
        card_id,
      ]);
      logger.info(`Card created - ${JSON.stringify(card)}`);
      return card;
    } catch (error) {
      logger.error(
        `An error occured when editing a card - ${JSON.stringify(error)}`
      );
      throw error;
    }
  }

  async deleteCard(id: number): Promise<CardModel> {
    try {
      logger.info(`***** Card Service *****: Deleting card with data - ${id}`);
      const card = await db.oneOrNone(cardQueries.deleteCard, [id]);
      logger.info(`Card created - ${JSON.stringify(card)}`);
      return card;
    } catch (error) {
      logger.error(
        `An error occured when deleting a card - ${JSON.stringify(error)}`
      );
      throw error;
    }
  }

  async fetchDisplayCard(user_id: number): Promise<DisplayCardModel> {
    try {
      logger.info(
        `***** Card Service *****: Fetching display card for user - ${user_id}`
      );
      const Displaycard = await db.oneOrNone(cardQueries.fetchDisplayCard, [
        user_id,
      ]);
      logger.info(`Card data fetched - ${JSON.stringify(Displaycard)}`);
      return Displaycard;
    } catch (error) {
      logger.error(
        `An error occured when fetching display cards - ${JSON.stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async fetchUserCards(
    data: SearchFilterCardSchema,
    user_id: number
  ): Promise<CardModel[]> {
    try {
      logger.info(
        `***** Card Service *****: Editing card with data - ${JSON.stringify(
          data
        )}`
      );
      let cards: CardModel[];
      if (data?.search) {
        const search = `%${data.search}%`;
        cards = await db.manyOrNone(cardQueries.fetchSearchedUserCards, [
          user_id,
          search,
        ]);
      } else {
        cards = await db.manyOrNone(cardQueries.fetchAllUserCards, [user_id]);
      }
      logger.info(`Cards fetched - ${JSON.stringify(cards)}`);
      return cards;
    } catch (error) {
      logger.error(
        `An error occured when editing a card - ${JSON.stringify(error)}`
      );
      throw error;
    }
  }

  async answerCard(
    isCorrect: boolean,
    card_id: number,
    bin: number,
    user_id: number
  ): Promise<DisplayCardModel> {
    try {
      logger.info(
        `***** Card Service *****: Answering card with values - ${JSON.stringify(
          {
            isCorrect,
            card_id,
            bin,
            user_id,
          }
        )}`
      );
      let interval: string = BinTimeEnum[`_${bin + 1}`];
      if (isCorrect) {
        if (bin >= 10) db.none(cardQueries.setCardToNeverTime, [card_id]);
        db.none(cardQueries.increaseCardTime, [card_id, interval, bin + 1]);
      } else {
        if (bin > 0) {
          await db.none(cardQueries.cardWronglyCorrectly, [card_id]);
        } else {
          await db.none(cardQueries.zeroCardWronglyCorrectly, [card_id])
        }
        // Get card info
        const { wrongly_answered_count } = await db.oneOrNone(cardQueries.fetchCardById, [card_id]);
        // Check if wrongly answered is 10
        if (wrongly_answered_count > 9) {
          db.none(cardQueries.setCardAsHardToAnswer, [card_id])
        }
        // If so, put into hard to remember bin
      }
      const card: DisplayCardModel = await db.one(
        cardQueries.fetchDisplayCard,
        [user_id]
      );
      logger.info(`Cards fetched - ${JSON.stringify(card)}`);
      return card;
    } catch (error) {
      logger.error(
        `An error occured when editing a card - ${JSON.stringify(error)}`
      );
      throw error;
    }
  }

  async fetchCardById(id: number): Promise<CardModel> {
    try {
      logger.info(`***** Card Service *****: Fetching card by id - ${id}`);

      const card = await db.oneOrNone(cardQueries.fetchCardById, [id]);
      logger.info(`Card fetched - ${JSON.stringify(card)}`);
      return card;
    } catch (error) {
      logger.error(
        `An error occured when fetching a card by id - ${JSON.stringify(error)}`
      );
      throw error;
    }
  }
  
}

const cardService = new CardService();

export default cardService;
