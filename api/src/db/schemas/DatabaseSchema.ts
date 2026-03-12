import { z } from "zod";
import { cragsSchema } from "./crags/CragsSchema";
import { locationsSchema } from "./locations/LocationsSchema";

export class DatabaseSchema {
  public readonly databaseSchema = z.object({
    locations: locationsSchema,
    crags: cragsSchema,
    routes: z.array(z.object({})),
    climbLogs: z.array(z.object({})),
  });
}
