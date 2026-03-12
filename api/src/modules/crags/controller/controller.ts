import { Request, Response } from "express";
import {
  CreateCragBody,
  UpdateCragBody,
} from "../../../db/schemas/crags/CragsSchema";
import { idParamSchema } from "../../../db/schemas/global/params";
import * as service from "../service/service";

type CreateCragRequest = Request<unknown, unknown, CreateCragBody>;
type UpdateCragRequest = Request<unknown, unknown, UpdateCragBody>;

export class CragsController {
  public async getCrags(_: Request, res: Response) {
    const cragService = new service.CragService();
    const crags = await cragService.listCrags();

    res.json(crags);
  }

  public async createCrag(req: CreateCragRequest, res: Response) {
    const cragService = new service.CragService();
    const crag = await cragService.addCrag(req.body);

    res.status(201).json(crag);
  }

  public async getCragById(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);

    const cragService = new service.CragService();
    const crag = await cragService.getCragById(id);

    return res.json(crag);
  }

  public async updateCrag(req: UpdateCragRequest, res: Response) {
    const { id } = idParamSchema.parse(req.params);

    const cragService = new service.CragService();
    const crag = await cragService.updateCrag(id, req.body);

    return res.json(crag);
  }

  public async deleteCrag(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);

    const cragService = new service.CragService();
    await cragService.deleteCrag(id);

    return res.status(204).send();
  }
}
