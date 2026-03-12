import { z } from "zod";
import { locationsSchema } from "./locations/LocationsSchema";

export class DatabaseSchema {
  public readonly databaseSchema = z.object({
    locations: locationsSchema,
    crags: z.array(z.object({})),
    routes: z.array(z.object({})),
    climbLogs: z.array(z.object({})),
  });
}
