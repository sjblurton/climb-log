import { Request, Response } from "express";
import * as service from "../service/service";

export class LocationsController {
  public async getLocations(_: Request, res: Response) {
    const locationService = new service.LocationService();
    const locations = await locationService.listLocations();
    res.json(locations);
  }

  public async createLocation(req: Request, res: Response) {
    const { name } = req.body;

    const locationService = new service.LocationService();
    const location = await locationService.addLocation(name);

    res.status(201).json(location);
  }

  public async getLocationById(req: Request, res: Response) {
    const { id } = req.params;

    if (Array.isArray(id) || !id) {
      return res.status(400).json({ message: "Invalid location ID" });
    }

    const locationService = new service.LocationService();
    const location = await locationService.getLocationById(id);

    return res.json(location);
  }

  public async updateLocation(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    if (Array.isArray(id) || !id) {
      return res.status(400).json({ message: "Invalid location ID" });
    }

    const locationService = new service.LocationService();
    const location = await locationService.updateLocation(id, name);

    return res.json(location);
  }
}
