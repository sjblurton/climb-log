import {
  locationOpenApiPaths,
  locationOpenApiSchemas,
} from "../modules/locations/docs/openapi";

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Climb Log API",
    version: "1.0.0",
    description: "REST API for managing climbing locations.",
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
  ],
  paths: locationOpenApiPaths,
  components: {
    schemas: locationOpenApiSchemas,
  },
} as const;
