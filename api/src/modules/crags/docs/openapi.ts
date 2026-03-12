import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  createCragBodySchema,
  cragSchema,
  cragsSchema,
  updateCragBodySchema,
} from "../../../db/schemas/crags/CragsSchema";
import { idParamSchema } from "../../../db/schemas/global/params";

const registry = new OpenAPIRegistry();

const cragResponseSchema = cragSchema.meta({
  id: "Crag",
  example: {
    id: "crag_123",
    location_id: "loc_123",
    name: "Raven Tor",
    type: "outdoor",
    created_at: "2026-03-12T10:00:00.000Z",
    updated_at: "2026-03-12T10:00:00.000Z",
  },
});

const cragsResponseSchema = cragsSchema.meta({
  id: "Crags",
  example: [
    {
      id: "crag_123",
      location_id: "loc_123",
      name: "Raven Tor",
      type: "outdoor",
      created_at: "2026-03-12T10:00:00.000Z",
      updated_at: "2026-03-12T10:00:00.000Z",
    },
    {
      id: "crag_456",
      location_id: "loc_456",
      name: "The Depot Manchester",
      type: "indoor",
      created_at: "2026-03-12T11:00:00.000Z",
      updated_at: "2026-03-12T11:30:00.000Z",
    },
  ],
});

const createCragRequestSchema = createCragBodySchema.meta({
  id: "CreateCragBody",
  example: {
    location_id: "loc_123",
    name: "Raven Tor",
    type: "outdoor",
  },
});

const updateCragRequestSchema = updateCragBodySchema.meta({
  id: "UpdateCragBody",
  example: {
    name: "Raven Tor Main Wall",
  },
});

const validationErrorSchema = z
  .object({
    message: z.string(),
    errors: z.string(),
  })
  .meta({
    id: "CragValidationError",
    example: {
      message: "Validation failed",
      errors: "type: Type must be indoor or outdoor",
    },
  });

const errorResponseSchema = z
  .object({
    message: z.string(),
  })
  .meta({
    id: "CragErrorResponse",
    example: {
      message: "Crag not found",
    },
  });

registry.registerPath({
  method: "get",
  path: "/crags",
  tags: ["Crags"],
  summary: "List crags",
  responses: {
    "200": {
      description: "List of crags",
      content: {
        "application/json": {
          schema: cragsResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/crags",
  tags: ["Crags"],
  summary: "Create crag",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createCragRequestSchema,
        },
      },
    },
  },
  responses: {
    "201": {
      description: "Created crag",
      content: {
        "application/json": {
          schema: cragResponseSchema,
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
  path: "/crags/{id}",
  tags: ["Crags"],
  summary: "Get crag by ID",
  request: {
    params: idParamSchema,
  },
  responses: {
    "200": {
      description: "Crag found",
      content: {
        "application/json": {
          schema: cragResponseSchema,
        },
      },
    },
    "404": {
      description: "Crag not found",
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
  path: "/crags/{id}",
  tags: ["Crags"],
  summary: "Update crag",
  request: {
    params: idParamSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateCragRequestSchema,
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Updated crag",
      content: {
        "application/json": {
          schema: cragResponseSchema,
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
      description: "Crag not found",
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
  path: "/crags/{id}",
  tags: ["Crags"],
  summary: "Delete crag",
  request: {
    params: idParamSchema,
  },
  responses: {
    "204": {
      description: "Crag deleted",
    },
    "404": {
      description: "Crag not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

const cragOpenApiDocument = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "Climb Log API - Crags",
    version: "1.0.0",
  },
});

export const cragOpenApiPaths = cragOpenApiDocument.paths;
export const cragOpenApiSchemas = cragOpenApiDocument.components?.schemas || {};
