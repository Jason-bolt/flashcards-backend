interface CardModel {
  id: string;
  word: string;
  definition: string;
  bin: string;
  time_to_appear: string;
  wrongly_answered_count: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface DisplayCardModel {
  id: number;
  word: string;
  definition: string;
  bins: {
    bin: string;
    card_count: number;
  }[];
}

export default CardModel;
