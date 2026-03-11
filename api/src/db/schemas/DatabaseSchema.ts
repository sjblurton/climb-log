import { z } from "zod";
import { LocationsSchema } from "./locations/LocationsSchema";

export class DatabaseSchema {
  public readonly locationsSchema = new LocationsSchema();

  public readonly databaseSchema = z.object({
    locations: this.locationsSchema.locationsSchema,
    crags: z.array(z.object({})),
    routes: z.array(z.object({})),
    climbLogs: z.array(z.object({})),
  });
}
