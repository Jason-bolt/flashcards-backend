import "mocha";
import chai from "chai";
import sinon from "sinon";
import db from "../../config/database";
import { StatusCodes } from "http-status-codes";
import cardResolvers from "../../resolvers/card";
import {
  createCardFixture,
  editCardFixture,
  searchUserCardFixture,
} from "./card.fixtures";

const expect = chai.expect;

const userValue = {
  id: 1,
  username: "Bolt",
  password: "$2b$10$eeYE0Dtrzj.gjpZnQGhNfuGRohh/f01msLdHIUjE0uEotYbOypEDe",
};

const cardValue = {
  id: 3,
  word: "Wordsss 11",
  definition: "Descriptionsss",
  bin: "0",
  time_to_appear: "2024-04-12T07:57:45.460Z",
  wrongly_answered_count: 0,
  user_id: 1,
  created_at: "2024-04-12T07:57:45.460Z",
  updated_at: "2024-04-12T07:57:45.460Z",
};

const hardToRemeberCardValue = {
  id: 3,
  word: "Wordsss 11",
  definition: "Descriptionsss",
  bin: "0",
  time_to_appear: "2024-04-12T07:57:45.460Z",
  wrongly_answered_count: 0,
  user_id: 1,
  created_at: "2024-04-12T07:57:45.460Z",
  updated_at: "2024-04-12T07:57:45.460Z",
};

const getNull = async () => {};
const getUser = async () => userValue;
const getCard = async () => cardValue;
const getHardToRemeberCard = async () => hardToRemeberCardValue;

describe("Card tests", () => {
  afterEach(function () {
    sinon.restore();
  });

  it("Should create card successfully", async () => {
    sinon.replace(db, "one", sinon.fake.resolves(getCard()));
    const result = await cardResolvers.Mutation.createCard(
      null,
      { data: createCardFixture },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.CREATED);
  });

  it("Should fail to create card - server error", async () => {
    sinon.replace(db, "one", sinon.fake.rejects([]));
    const result = await cardResolvers.Mutation.createCard(
      null,
      { data: createCardFixture },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Should edit card successfully", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getCard()));
    sinon.replace(db, "one", sinon.fake.resolves(getCard()));
    const result = await cardResolvers.Mutation.editCard(
      null,
      { data: editCardFixture, card_id: 1 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should fail to edit card - no card found", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getNull()));
    sinon.replace(db, "one", sinon.fake.resolves(getCard()));
    const result = await cardResolvers.Mutation.editCard(
      null,
      { data: editCardFixture, card_id: 1 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.BAD_REQUEST);
  });

  it("Should fail to edit card - server error", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getCard()));
    sinon.replace(db, "one", sinon.fake.rejects([]));
    const result = await cardResolvers.Mutation.editCard(
      null,
      { data: editCardFixture, card_id: 1 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Should delete card successfully", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getCard()));
    const result = await cardResolvers.Mutation.deleteCard(
      null,
      { card_id: 1 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should fail to delete card - server error", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.rejects([]));
    const result = await cardResolvers.Mutation.deleteCard(
      null,
      { card_id: 1 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Should answer card correctly successfully", async () => {
    sinon.replace(db, "one", sinon.fake.resolves(getCard()));
    sinon.replace(db, "none", sinon.fake.resolves(getNull()));
    const result = await cardResolvers.Mutation.answerCard(
      null,
      { isCorrect: true, card_id: 1, bin: 2 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should answer card wrongly successfully", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getCard()));
    sinon.replace(db, "one", sinon.fake.resolves(getCard()));
    sinon.replace(db, "none", sinon.fake.resolves(getNull()));
    const result = await cardResolvers.Mutation.answerCard(
      null,
      { isCorrect: false, card_id: 1, bin: 2 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should answer card correctly, bin 10 successfully", async () => {
    sinon.replace(db, "one", sinon.fake.resolves(getCard()));
    sinon.replace(db, "none", sinon.fake.resolves(getNull()));
    const result = await cardResolvers.Mutation.answerCard(
      null,
      { isCorrect: true, card_id: 1, bin: 10 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should answer card wrongly 10 times successfully", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getHardToRemeberCard()));
    sinon.replace(db, "one", sinon.fake.resolves(getCard()));
    sinon.replace(db, "none", sinon.fake.resolves(getNull()));
    const result = await cardResolvers.Mutation.answerCard(
      null,
      { isCorrect: false, card_id: 1, bin: 10 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should fail to answer card - server error", async () => {
    sinon.replace(db, "one", sinon.fake.rejects([]));
    sinon.replace(db, "none", sinon.fake.resolves(getNull()));
    const result = await cardResolvers.Mutation.answerCard(
      null,
      { isCorrect: false, card_id: 1, bin: 10 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Should fetch all user cards successfully", async () => {
    sinon.replace(db, "manyOrNone", sinon.fake.resolves([cardValue]));
    const result = await cardResolvers.Query.fetchUserCards(
      null,
      { data: null },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should fetch all user searched cards successfully", async () => {
    sinon.replace(db, "manyOrNone", sinon.fake.resolves([cardValue]));
    const result = await cardResolvers.Query.fetchUserCards(
      null,
      { data: searchUserCardFixture },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should fail to fetch all user cards - server error", async () => {
    sinon.replace(db, "manyOrNone", sinon.fake.rejects([]));
    const result = await cardResolvers.Query.fetchUserCards(
      null,
      { data: searchUserCardFixture },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Should fetch card by id successfully", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getCard()));
    const result = await cardResolvers.Query.fetchCardById(
      null,
      { id: 1 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should fail to fetch card by id - server error", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.rejects([]));
    const result = await cardResolvers.Query.fetchCardById(
      null,
      { id: 1 },
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Should fetch display card successfully", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getCard()));
    const result = await cardResolvers.Query.fetchDisplayCard(
      null,
      null,
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });

  it("Should fail to fetch display card - server error", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.rejects([]));
    const result = await cardResolvers.Query.fetchDisplayCard(
      null,
      null,
      { user: userValue },
      null
    );
    expect(result.status).to.eql(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
