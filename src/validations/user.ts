import z from "zod";

export const registerUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  passwordConfirmation: z.string(),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type RegisterUserSchema = typeof registerUserSchema._type;
export type LoginSchema = typeof loginSchema._type;
