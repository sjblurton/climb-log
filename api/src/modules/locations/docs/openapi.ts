import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { z } from "zod";
import { idParamSchema } from "../../../db/schemas/global/params";
import {
  createUpdateLocationBodySchema,
  locationSchema,
  locationsSchema,
} from "../../../db/schemas/locations/LocationsSchema";

const registry = new OpenAPIRegistry();

const locationResponseSchema = locationSchema.meta({
  id: "Location",
  example: {
    id: "loc_123",
    name: "The Depot Manchester",
    created_at: "2026-03-12T10:00:00.000Z",
    updated_at: "2026-03-12T10:00:00.000Z",
  },
});

const locationsResponseSchema = locationsSchema.meta({
  id: "Locations",
  example: [
    {
      id: "loc_123",
      name: "The Depot Manchester",
      created_at: "2026-03-12T10:00:00.000Z",
      updated_at: "2026-03-12T10:00:00.000Z",
    },
    {
      id: "loc_456",
      name: "The Climbing Hangar",
      created_at: "2026-03-12T11:00:00.000Z",
      updated_at: "2026-03-12T11:30:00.000Z",
    },
  ],
});

const createUpdateLocationRequestSchema = createUpdateLocationBodySchema.meta({
  id: "CreateUpdateLocationBody",
  example: {
    name: "The Climbing Hangar",
  },
});

const validationErrorSchema = z
  .object({
    message: z.string(),
    errors: z.string(),
  })
  .meta({
    id: "ValidationError",
    example: {
      message: "Validation failed",
      errors: "name: Name is required",
    },
  });

const errorResponseSchema = z
  .object({
    message: z.string(),
  })
  .meta({
    id: "ErrorResponse",
    example: {
      message: "Location not found",
    },
  });

registry.registerPath({
  method: "get",
  path: "/locations",
  tags: ["Locations"],
  summary: "List locations",
  responses: {
    "200": {
      description: "List of locations",
      content: {
        "application/json": {
          schema: locationsResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/locations",
  tags: ["Locations"],
  summary: "Create location",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createUpdateLocationRequestSchema,
        },
      },
    },
  },
  responses: {
    "201": {
      description: "Created location",
      content: {
        "application/json": {
          schema: locationResponseSchema,
        },
      },
    },
    "400": {
      description: "Validation failed",
      content: {
        "application/json": {
          schema: validationErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/locations/{id}",
  tags: ["Locations"],
  summary: "Get location by ID",
  request: {
    params: idParamSchema,
  },
  responses: {
    "200": {
      description: "Location found",
      content: {
        "application/json": {
          schema: locationResponseSchema,
        },
      },
    },
    "404": {
      description: "Location not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/locations/{id}",
  tags: ["Locations"],
  summary: "Update location",
  request: {
    params: idParamSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createUpdateLocationRequestSchema,
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Updated location",
      content: {
        "application/json": {
          schema: locationResponseSchema,
        },
      },
    },
    "400": {
      description: "Validation failed",
      content: {
        "application/json": {
          schema: validationErrorSchema,
        },
      },
    },
    "404": {
      description: "Location not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/locations/{id}",
  tags: ["Locations"],
  summary: "Delete location",
  request: {
    params: idParamSchema,
  },
  responses: {
    "204": {
      description: "Location deleted",
    },
    "404": {
      description: "Location not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

const locationOpenApiDocument = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "Climb Log API - Locations",
    version: "1.0.0",
  },
});

export const locationOpenApiPaths = locationOpenApiDocument.paths;
export const locationOpenApiSchemas =
  locationOpenApiDocument.components?.schemas || {};
