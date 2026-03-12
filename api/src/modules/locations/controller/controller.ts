import { Request, Response } from "express";
import * as service from "../service/service";
import { idParamSchema } from "../../../db/schemas/global/params";
import { CreateUpdateLocationBody } from "../../../db/schemas/locations/LocationsSchema";

type IdParamRequest = Request<unknown, unknown, CreateUpdateLocationBody>;

export class LocationsController {
  public async getLocations(_: Request, res: Response) {
    const locationService = new service.LocationService();
    const locations = await locationService.listLocations();
    res.json(locations);
  }

  public async createLocation(req: IdParamRequest, res: Response) {
    const { name } = req.body;

    const locationService = new service.LocationService();
    const location = await locationService.addLocation(name);

    res.status(201).json(location);
  }

  public async getLocationById(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);

    const locationService = new service.LocationService();
    const location = await locationService.getLocationById(id);

    return res.json(location);
  }

  public async updateLocation(req: IdParamRequest, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const { name } = req.body;

    const locationService = new service.LocationService();
    const location = await locationService.updateLocation(id, name);

    return res.json(location);
  }
}
