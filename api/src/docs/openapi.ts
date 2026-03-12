import {
  cragOpenApiPaths,
  cragOpenApiSchemas,
} from "../modules/crags/docs/openapi";
import {
  locationOpenApiPaths,
  locationOpenApiSchemas,
} from "../modules/locations/docs/openapi";

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Climb Log API",
    version: "1.0.0",
    description: "REST API for managing climbing locations and crags.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Locations",
      description: "Manage climbing locations",
    },
    {
      name: "Crags",
      description: "Manage climbing crags",
    },
  ],
  paths: {
    ...locationOpenApiPaths,
    ...cragOpenApiPaths,
  },
  components: {
    schemas: {
      ...locationOpenApiSchemas,
      ...cragOpenApiSchemas,
    },
  },
} as const;
