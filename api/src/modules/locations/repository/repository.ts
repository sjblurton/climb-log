import { randomUUID } from "crypto";
import { Database } from "../../../db/db";
import { HttpError } from "../../../middleware/errorHandler";

const LOCATION_NOT_FOUND_ERROR = "Location not found";

export class LocationRepository {
  database = new Database();

  async getAllLocations() {
    console.log("Reading locations from database");
    const db = await this.database.read();
    return db.locations;
  }

  async createLocation(name: string) {
    const db = await this.database.read();

    const location = {
      id: `loc_${randomUUID()}`,
      name,
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
    await this.database.write(db);
    return location;
  }
}
