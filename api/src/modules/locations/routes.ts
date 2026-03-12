import { Router } from "express";
import * as controller from "./controller/controller";
import { validateBody } from "../../middleware/validation/validateBody";
import { createUpdateLocationBodySchema } from "../../db/schemas/locations/LocationsSchema";

const router = Router();

const locationsController = new controller.LocationsController();

router.get("/", locationsController.getLocations);
router.post(
  "/",
  validateBody(createUpdateLocationBodySchema),
  locationsController.createLocation,
);

router.get("/:id", locationsController.getLocationById);
router.patch(
  "/:id",
  validateBody(createUpdateLocationBodySchema),
  locationsController.updateLocation,
);

export default router;
