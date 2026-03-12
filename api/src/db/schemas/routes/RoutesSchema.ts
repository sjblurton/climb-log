import { z } from "zod";

const NAME_ERROR = "Name is required";
const CRAG_ID_ERROR = "Crag ID is required";
const CLIMB_TYPE_ERROR = "Climb type must be boulder or lead";
const GRADE_TYPE_ERROR = "Grade type must be font or yds";
const GRADE_VALUE_ERROR = "Grade value must be an integer";

export const climbTypeSchema = z.enum(["boulder", "lead"], {
  error: CLIMB_TYPE_ERROR,
});

export const gradeTypeSchema = z.enum(["font", "yds"], {
  error: GRADE_TYPE_ERROR,
});

export const routeSchema = z.object({
  id: z.string(),
  crag_id: z.string().min(1, CRAG_ID_ERROR),
  name: z.string().min(1, NAME_ERROR),
  climb_type: climbTypeSchema,
  grade_type: gradeTypeSchema,
  grade_value: z.number({ error: GRADE_VALUE_ERROR }).int(GRADE_VALUE_ERROR),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

const routeMutableSchema = routeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const createRouteBodySchema = routeMutableSchema.omit({
  is_active: true,
});

export const updateRouteBodySchema = routeMutableSchema.partial();

export const routesSchema = z.array(routeSchema);

export type Route = z.infer<typeof routeSchema>;

export type CreateRouteBody = z.infer<typeof createRouteBodySchema>;

export type UpdateRouteBody = z.infer<typeof updateRouteBodySchema>;
