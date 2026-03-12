import { z } from "zod";

const NAME_ERROR = "Name is required";

export const locationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, NAME_ERROR),
});

export const createUpdateLocationBodySchema = locationSchema.omit({
  id: true,
});

export const locationsSchema = z.array(locationSchema);

export type CreateUpdateLocationBody = z.infer<
  typeof createUpdateLocationBodySchema
>;
