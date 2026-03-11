import express from "express";
import cors from "cors";
import locationRoutes from "./modules/locations/routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/locations", locationRoutes);

app.use(errorHandler);

export default app;
