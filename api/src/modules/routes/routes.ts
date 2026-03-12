import { Router } from "express";
import {
  createRouteBodySchema,
  updateRouteBodySchema,
} from "../../db/schemas/routes/RoutesSchema";
import { validateBody } from "../../middleware/validation/validateBody";
import * as controller from "./controller/controller";

const router = Router();

const routesController = new controller.RoutesController();

router.get("/", routesController.getRoutes);
router.post(
  "/",
  validateBody(createRouteBodySchema),
  routesController.createRoute,
);
router.get("/:id", routesController.getRouteById);
router.patch(
  "/:id",
  validateBody(updateRouteBodySchema),
  routesController.updateRoute,
);
router.delete("/:id", routesController.deleteRoute);

export default router;
