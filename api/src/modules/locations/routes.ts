import { Router } from "express";
import * as controller from "./controller/controller";
import { LocationsSchema } from "../../db/schemas/locations/LocationsSchema";
import { validateBody } from "../../middleware/validate";

const router = Router();

const locationsController = new controller.LocationsController();
const locationSchema = new LocationsSchema();

router.get("/", locationsController.getLocations);
router.post(
  "/",
  validateBody(locationSchema.createUpdateLocationSchema),
  locationsController.createLocation,
);

router.get("/:id", locationsController.getLocationById);
router.put(
  "/:id",
  validateBody(locationSchema.createUpdateLocationSchema),
  locationsController.updateLocation,
);

export default router;
