import * as bcrypt from "bcrypt";
import envs from "../../config/env";

export const hashText = async (text: string) => {
  const hashedText = await bcrypt.hash(text, Number(envs.SALT_ROUNDS));
  return hashedText;
};

export const comparePasswords = (
  inputtedPassword: string,
  dbPassword: string
): Promise<boolean> => {
  return bcrypt.compare(inputtedPassword, dbPassword);
};

export const checkPasswords = (
  password: string,
  passwordConfirmation: string
): boolean => {
  if (password.length < 8) {
    return false;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  const validPassword = passwordRegex.test(password);

  if (!validPassword) {
    return false;
  }

  if (password !== passwordConfirmation) {
    return false;
  }

  return true;
};
