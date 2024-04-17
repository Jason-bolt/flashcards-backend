import "mocha";
import userResolvers from "../../resolvers/user";
import { createUserFixture, loginUserFixture } from "./user.fixtures";
import chai from "chai";
import sinon from "sinon";
import db from "../../config/database";
import userService from "../../services/user/user.service";
import { StatusCodes } from "http-status-codes";

const expect = chai.expect;

const userValue = {
  id: 1,
  ...loginUserFixture,
  password: "$2b$10$eeYE0Dtrzj.gjpZnQGhNfuGRohh/f01msLdHIUjE0uEotYbOypEDe",
};

const getUser = async () => userValue;
const getNull = async () => {};

describe("User tests", () => {
  afterEach(function () {
    sinon.restore();
  });

  it("Should create user successfully", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getNull()));
    sinon.replace(db, "one", sinon.fake.resolves(getUser()));
    const result = await userResolvers.Mutation.registerUser(
      null,
      { data: createUserFixture },
      null,
      null
    );
    expect(result.status).to.eql(StatusCodes.CREATED);
  });

  it("Should fail to create user - user already exists", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getUser()));
    sinon.replace(db, "one", sinon.fake.resolves(getUser()));
    const result = await userResolvers.Mutation.registerUser(
      null,
      { data: createUserFixture },
      null,
      null
    );
    expect(result.status).to.eql(StatusCodes.CONFLICT);
  });

  it("Should fail to create user - unique user check fail", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.rejects([]));
    sinon.replace(db, "one", sinon.fake.resolves(getUser()));
    const result = await userResolvers.Mutation.registerUser(
      null,
      { data: createUserFixture },
      null,
      null
    );
    expect(result.status).to.eql(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Should fail to create user - server error", async () => {
    sinon.replace(db, "oneOrNone", sinon.fake.resolves(getNull()));
    sinon.replace(db, "one", sinon.fake.rejects([]));
    const result = await userResolvers.Mutation.registerUser(
      null,
      { data: createUserFixture },
      null,
      null
    );
    expect(result.status).to.eql(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Should log user in successfully", async () => {
    sinon.replace(userService, "getUser", sinon.fake.resolves(getUser()));
    const result = await userResolvers.Mutation.login(
      null,
      { data: loginUserFixture },
      null,
      null
    );
    expect(result.status).to.eql(StatusCodes.OK);
  });
  
  it("Should fail to log user in - wrong initials", async () => {
    sinon.replace(userService, "getUser", sinon.fake.resolves(getNull()));
    const result = await userResolvers.Mutation.login(
      null,
      { data: loginUserFixture },
      null,
      null
    );
    expect(result.status).to.eql(StatusCodes.BAD_REQUEST);
  });
});
