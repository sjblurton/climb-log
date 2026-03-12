import { z } from "zod";
import { cragsSchema } from "./crags/CragsSchema";
import { locationsSchema } from "./locations/LocationsSchema";
import { routesSchema } from "./routes/RoutesSchema";

export class DatabaseSchema {
  public readonly databaseSchema = z.object({
    locations: locationsSchema,
    crags: cragsSchema,
    routes: routesSchema,
    climbLogs: z.array(z.object({})),
  });
}
