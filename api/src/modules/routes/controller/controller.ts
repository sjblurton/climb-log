import { Request, Response } from "express";
import {
  CreateRouteBody,
  UpdateRouteBody,
} from "../../../db/schemas/routes/RoutesSchema";
import { idParamSchema } from "../../../db/schemas/global/params";
import * as service from "../service/service";

type CreateRouteRequest = Request<unknown, unknown, CreateRouteBody>;
type UpdateRouteRequest = Request<unknown, unknown, UpdateRouteBody>;

export class RoutesController {
  public async getRoutes(_: Request, res: Response) {
    const routeService = new service.RouteService();
    const routes = await routeService.listRoutes();

    res.json(routes);
  }

  public async createRoute(req: CreateRouteRequest, res: Response) {
    const routeService = new service.RouteService();
    const route = await routeService.addRoute(req.body);

    res.status(201).json(route);
  }

  public async getRouteById(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);

    const routeService = new service.RouteService();
    const route = await routeService.getRouteById(id);

    return res.json(route);
  }

  public async updateRoute(req: UpdateRouteRequest, res: Response) {
    const { id } = idParamSchema.parse(req.params);

    const routeService = new service.RouteService();
    const route = await routeService.updateRoute(id, req.body);

    return res.json(route);
  }

  public async deleteRoute(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);

    const routeService = new service.RouteService();
    await routeService.deleteRoute(id);

    return res.status(204).send();
  }
}
