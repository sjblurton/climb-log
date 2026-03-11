import { z } from "zod";

const NAME_ERROR = "Name is required";

export class LocationsSchema {
  public readonly locationSchema = z.object({
    id: z.string(),
    name: z.string().min(1, NAME_ERROR),
  });

  public readonly createUpdateLocationSchema = this.locationSchema.omit({
    id: true,
  });

  public readonly locationsSchema = z.array(this.locationSchema);
}
