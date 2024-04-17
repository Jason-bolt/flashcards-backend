import { configDotenv } from "dotenv";
configDotenv();

const envs = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY,
};

export default envs;
