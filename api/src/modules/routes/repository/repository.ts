import { randomUUID } from "crypto";
import {
  CreateRouteBody,
  UpdateRouteBody,
} from "../../../db/schemas/routes/RoutesSchema";
import { sharedDatabase } from "../../../db/db";
import { HttpError } from "../../../middleware/errors/HttpError";

const ROUTE_NOT_FOUND_ERROR = "Route not found";

export class RouteRepository {
  database = sharedDatabase;

  async getAllRoutes() {
    const db = await this.database.read();
    return db.routes;
  }

  async createRoute(data: CreateRouteBody) {
    const db = await this.database.read();
    const now = new Date().toISOString();

    const route = {
      id: `route_${randomUUID()}`,
      crag_id: data.crag_id,
      name: data.name,
      climb_type: data.climb_type,
      grade_type: data.grade_type,
      grade_value: data.grade_value,
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    db.routes.push(route);
    await this.database.write(db);

    return route;
  }

  async getRouteById(id: string) {
    const db = await this.database.read();
    const route = db.routes.find((item) => item.id === id);

    if (!route) {
      throw new HttpError(404, ROUTE_NOT_FOUND_ERROR);
    }

    return route;
  }

  async updateRoute(id: string, data: UpdateRouteBody) {
    const db = await this.database.read();
    const route = db.routes.find((item) => item.id === id);

    if (!route) {
      throw new HttpError(404, ROUTE_NOT_FOUND_ERROR);
    }

    const patchData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as UpdateRouteBody;

    Object.assign(route, patchData);
    route.updated_at = new Date().toISOString();

    await this.database.write(db);
    return route;
  }

  async deleteRoute(id: string) {
    const db = await this.database.read();
    const routeIndex = db.routes.findIndex((item) => item.id === id);

    if (routeIndex === -1) {
      throw new HttpError(404, ROUTE_NOT_FOUND_ERROR);
    }

    db.routes.splice(routeIndex, 1);
    await this.database.write(db);
  }
}
