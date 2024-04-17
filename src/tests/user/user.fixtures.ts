import { faker } from "@faker-js/faker";

const password: string = `Pass@1234`;

export const createUserFixture = {
  username: faker.word.noun(),
  password,
  passwordConfirmation: password,
};

export const loginUserFixture = {
  username: faker.word.noun(),
  password,
};
