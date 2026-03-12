import { randomUUID } from "crypto";
import { CreateUpdateCragBody } from "../../../db/schemas/crags/CragsSchema";
import { sharedDatabase } from "../../../db/db";
import { HttpError } from "../../../middleware/errors/HttpError";

const CRAG_NOT_FOUND_ERROR = "Crag not found";

export class CragRepository {
  database = sharedDatabase;

  async getAllCrags() {
    const db = await this.database.read();
    return db.crags;
  }

  async createCrag(data: CreateUpdateCragBody) {
    const db = await this.database.read();

    const crag = {
      id: `crag_${randomUUID()}`,
      location_id: data.location_id,
      name: data.name,
      type: data.type,
      created_at: new Date().toISOString(),
    };

    db.crags.push(crag);
    await this.database.write(db);

    return crag;
  }

  async getCragById(id: string) {
    const db = await this.database.read();
    const crag = db.crags.find((item) => item.id === id);

    if (!crag) {
      throw new HttpError(404, CRAG_NOT_FOUND_ERROR);
    }

    return crag;
  }

  async updateCrag(id: string, data: CreateUpdateCragBody) {
    const db = await this.database.read();
    const crag = db.crags.find((item) => item.id === id);

    if (!crag) {
      throw new HttpError(404, CRAG_NOT_FOUND_ERROR);
    }

    crag.location_id = data.location_id;
    crag.name = data.name;
    crag.type = data.type;

    await this.database.write(db);
    return crag;
  }

  async deleteCrag(id: string) {
    const db = await this.database.read();
    const cragIndex = db.crags.findIndex((item) => item.id === id);

    if (cragIndex === -1) {
      throw new HttpError(404, CRAG_NOT_FOUND_ERROR);
    }

    db.crags.splice(cragIndex, 1);
    await this.database.write(db);
  }
}
