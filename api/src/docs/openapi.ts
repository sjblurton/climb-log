import {
  cragOpenApiPaths,
  cragOpenApiSchemas,
} from "../modules/crags/docs/openapi";
import {
  locationOpenApiPaths,
  locationOpenApiSchemas,
} from "../modules/locations/docs/openapi";
import {
  routeOpenApiPaths,
  routeOpenApiSchemas,
} from "../modules/routes/docs/openapi";

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Climb Log API",
    version: "1.0.0",
    description: "REST API for managing climbing locations, crags, and routes.",
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
    {
      name: "Routes",
      description: "Manage climbing routes",
    },
  ],
  paths: {
    ...locationOpenApiPaths,
    ...cragOpenApiPaths,
    ...routeOpenApiPaths,
  },
  components: {
    schemas: {
      ...locationOpenApiSchemas,
      ...cragOpenApiSchemas,
      ...routeOpenApiSchemas,
    },
  },
} as const;
