const cardSchema = `#graphql
    type Card {
        id: Int
        word: String
        definition: String
        bin: String
        time_to_appear: DateTime
        wrongly_answered_count: Int
        user_id: Int
        created_at: DateTime
        updated_at: DateTime
    }

    type bins {
        bin: String
        count: Int
    }

    type DisplayCard {
        id: Int
        word: String
        definition: String
        bin: String
        bins: [bins!]
        are_cards_done: Boolean
        card_count: Int
    }

    # Inputs
    input newCardInput {
        word: String!
        definition: String!
    }
    
    input editCardInput {
        word: String!
        definition: String!
    }
    
    input searchFilterCardInput {
        search: String
    }

    # Responses
    type CardResponse {
        status: String!
        message: String!
        data: Card
    }
    
    type CardsResponse {
        status: String!
        message: String!
        data: [Card]
    }
    
    type DisplayCardResponse {
        status: String!
        message: String!
        data: DisplayCard
    }
    
    extend type Mutation {
        createCard(data: newCardInput!): CardResponse!
        editCard(data: editCardInput!, card_id: Int!): CardResponse!
        deleteCard(card_id: Int!): CardResponse!
        answerCard(isCorrect: Boolean!, card_id: Int!, bin: Int!): DisplayCardResponse!
    }

    extend type Query {
        fetchDisplayCard: DisplayCardResponse!
        fetchUserCards(data: searchFilterCardInput): CardsResponse!
        fetchCardById(id: Int!): CardResponse!
    }
`;

export default cardSchema;
