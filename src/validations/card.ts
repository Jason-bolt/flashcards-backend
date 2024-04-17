import z from "zod";

export const createCardSchema = z.object({
  word: z.string(),
  definition: z.string(),
});

export const editCardSchema = z.object({
  word: z.string(),
  definition: z.string(),
});

export const searchFilterCardSchema = z.object({
  search: z.string().optional(),
});

export type CreateCardSchema = typeof createCardSchema._type;
export type EditCardSchema = typeof editCardSchema._type;
export type SearchFilterCardSchema = typeof searchFilterCardSchema._type;
