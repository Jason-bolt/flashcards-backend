import { faker } from "@faker-js/faker";

export const createCardFixture = {
  word: faker.word.noun(),
  description: faker.lorem.words(),
};

export const editCardFixture = {
  word: faker.word.noun(),
  description: faker.lorem.words(),
};

export const searchUserCardFixture = {
  search: faker.word.noun(),
};
