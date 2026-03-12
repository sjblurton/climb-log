import { z } from "zod";

const NAME_ERROR = "Name is required";
const LOCATION_ID_ERROR = "Location ID is required";
const TYPE_ERROR = "Type must be indoor or outdoor";

export const cragTypeSchema = z.enum(["indoor", "outdoor"], {
  error: TYPE_ERROR,
});

export const cragSchema = z.object({
  id: z.string(),
  location_id: z.string().min(1, LOCATION_ID_ERROR),
  name: z.string().min(1, NAME_ERROR),
  type: cragTypeSchema,
  created_at: z.string(),
});

const cragBodySchema = cragSchema.omit({
  id: true,
  created_at: true,
});

export const createCragBodySchema = cragBodySchema;

export const updateCragBodySchema = cragBodySchema.partial();

export const cragsSchema = z.array(cragSchema);

export type CreateCragBody = z.infer<typeof createCragBodySchema>;

export type UpdateCragBody = z.infer<typeof updateCragBodySchema>;
