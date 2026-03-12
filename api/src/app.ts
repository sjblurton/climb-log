import express from "express";
import cors from "cors";
import locationRoutes from "./modules/locations/routes";
import cragRoutes from "./modules/crags/routes";
import { errorHandler } from "./middleware/errors/errorHandler";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/openapi";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/docs.json", (_req, res) => {
  res.json(openApiDocument);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/locations", locationRoutes);
app.use("/crags", cragRoutes);
app.use(errorHandler);

export default app;
