import CardModel, { DisplayCardModel } from "../../config/database/models/card";
import { CreateCardSchema, EditCardSchema, SearchFilterCardSchema } from "../../validations/card";

interface ICardService {
    createCard(data: CreateCardSchema, user_id: number): Promise<CardModel>
    editCard(data: EditCardSchema, card_id: number): Promise<CardModel>
    deleteCard(card_id: number): Promise<CardModel>
    fetchDisplayCard(user_id: number): Promise<DisplayCardModel>
    fetchUserCards(data: SearchFilterCardSchema, user_id: number): Promise<CardModel[]>
    answerCard(isCorrect: boolean, card_id: number, bin: number, user_id: number): Promise<DisplayCardModel>
    fetchCardById(id: number): Promise<CardModel>
    // areCardsDone(user_id: number): Promise<Boolean>
}

export default ICardService;