import { Router } from "express";
import {
  createCragBodySchema,
  updateCragBodySchema,
} from "../../db/schemas/crags/CragsSchema";
import { validateBody } from "../../middleware/validation/validateBody";
import * as controller from "./controller/controller";

const router = Router();

const cragsController = new controller.CragsController();

router.get("/", cragsController.getCrags);
router.post(
  "/",
  validateBody(createCragBodySchema),
  cragsController.createCrag,
);
router.get("/:id", cragsController.getCragById);
router.patch(
  "/:id",
  validateBody(updateCragBodySchema),
  cragsController.updateCrag,
);
router.delete("/:id", cragsController.deleteCrag);

export default router;
