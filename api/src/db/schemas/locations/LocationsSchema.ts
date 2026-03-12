import { z } from "zod";

const NAME_ERROR = "Name is required";

export const locationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, NAME_ERROR),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createUpdateLocationBodySchema = locationSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const locationsSchema = z.array(locationSchema);

export type CreateUpdateLocationBody = z.infer<
  typeof createUpdateLocationBodySchema
>;
