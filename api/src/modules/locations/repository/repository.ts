import { randomUUID } from "crypto";
import { sharedDatabase } from "../../../db/db";
import { HttpError } from "../../../middleware/errors/HttpError";

const LOCATION_NOT_FOUND_ERROR = "Location not found";

export class LocationRepository {
  database = sharedDatabase;

  async getAllLocations() {
    console.log("Reading locations from database");
    const db = await this.database.read();
    return db.locations;
  }

  async createLocation(name: string) {
    const db = await this.database.read();
    const now = new Date().toISOString();

    const location = {
      id: `loc_${randomUUID()}`,
      name,
      country: "GB" as const,
      created_at: now,
      updated_at: now,
    };

    db.locations.push(location);

    await this.database.write(db);

    return location;
  }

  async getLocationById(id: string) {
    const db = await this.database.read();
    const location = db.locations.find((loc) => loc.id === id);
    if (!location) {
      throw new HttpError(404, LOCATION_NOT_FOUND_ERROR);
    }
    return location;
  }

  async updateLocation(id: string, name: string) {
    const db = await this.database.read();
    const location = db.locations.find((loc) => loc.id === id);

    if (!location) {
      throw new HttpError(404, LOCATION_NOT_FOUND_ERROR);
    }

    location.name = name;
    location.updated_at = new Date().toISOString();
    await this.database.write(db);
    return location;
  }

  async deleteLocation(id: string) {
    const db = await this.database.read();
    const locationIndex = db.locations.findIndex((loc) => loc.id === id);

    if (locationIndex === -1) {
      throw new HttpError(404, LOCATION_NOT_FOUND_ERROR);
    }

    db.locations.splice(locationIndex, 1);
    await this.database.write(db);
  }
}
