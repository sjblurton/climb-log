import {
  CreateRouteBody,
  UpdateRouteBody,
} from "../../../db/schemas/routes/RoutesSchema";
import * as repo from "../repository/repository";
import { toRouteWithGradeLabel } from "../utils/toRouteWithGradeLabel";

export class RouteService {
  routeRepository = new repo.RouteRepository();

  async listRoutes() {
    const routes = await this.routeRepository.getAllRoutes();
    return routes.map(toRouteWithGradeLabel);
  }

  async addRoute(data: CreateRouteBody) {
    const route = await this.routeRepository.createRoute(data);
    return toRouteWithGradeLabel(route);
  }

  async getRouteById(id: string) {
    const route = await this.routeRepository.getRouteById(id);
    return toRouteWithGradeLabel(route);
  }

  async updateRoute(id: string, data: UpdateRouteBody) {
    const route = await this.routeRepository.updateRoute(id, data);
    return toRouteWithGradeLabel(route);
  }

  async deleteRoute(id: string) {
    return this.routeRepository.deleteRoute(id);
  }
}
