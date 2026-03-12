import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { idParamSchema } from "../../../db/schemas/global/params";
import {
  createRouteBodySchema,
  routeSchema,
  updateRouteBodySchema,
} from "../../../db/schemas/routes/RoutesSchema";

const registry = new OpenAPIRegistry();

const routeResponseSchema = routeSchema
  .extend({
    grade_label: z.string(),
  })
  .meta({
    id: "Route",
    example: {
      id: "route_123",
      crag_id: "crag_123",
      name: "Blue Slab",
      climb_type: "lead",
      grade_type: "yds",
      grade_value: 4,
      grade_label: "5.10a",
      is_active: true,
      created_at: "2026-03-12T10:00:00.000Z",
      updated_at: "2026-03-12T10:00:00.000Z",
    },
  });

const routesResponseSchema = z.array(routeResponseSchema).meta({
  id: "Routes",
  example: [
    {
      id: "route_123",
      crag_id: "crag_123",
      name: "Blue Slab",
      climb_type: "lead",
      grade_type: "yds",
      grade_value: 4,
      grade_label: "5.10a",
      is_active: true,
      created_at: "2026-03-12T10:00:00.000Z",
      updated_at: "2026-03-12T10:00:00.000Z",
    },
    {
      id: "route_456",
      crag_id: "crag_456",
      name: "Red Roof",
      climb_type: "boulder",
      grade_type: "font",
      grade_value: 7,
      grade_label: "6B",
      is_active: false,
      created_at: "2026-03-12T11:00:00.000Z",
      updated_at: "2026-03-12T12:00:00.000Z",
    },
  ],
});

const createRouteRequestSchema = createRouteBodySchema.meta({
  id: "CreateRouteBody",
  example: {
    crag_id: "crag_123",
    name: "Blue Slab",
    climb_type: "lead",
    grade_type: "yds",
    grade_value: 4,
  },
});

const updateRouteRequestSchema = updateRouteBodySchema.meta({
  id: "UpdateRouteBody",
  example: {
    is_active: false,
  },
});

const validationErrorSchema = z
  .object({
    message: z.string(),
    errors: z.string(),
  })
  .meta({
    id: "RouteValidationError",
    example: {
      message: "Validation failed",
      errors: "climb_type: Climb type must be boulder or lead",
    },
  });

const errorResponseSchema = z
  .object({
    message: z.string(),
  })
  .meta({
    id: "RouteErrorResponse",
    example: {
      message: "Route not found",
    },
  });

registry.registerPath({
  method: "get",
  path: "/routes",
  tags: ["Routes"],
  summary: "List routes",
  responses: {
    "200": {
      description: "List of routes",
      content: {
        "application/json": {
          schema: routesResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/routes",
  tags: ["Routes"],
  summary: "Create route",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createRouteRequestSchema,
        },
      },
    },
  },
  responses: {
    "201": {
      description: "Created route",
      content: {
        "application/json": {
          schema: routeResponseSchema,
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
  path: "/routes/{id}",
  tags: ["Routes"],
  summary: "Get route by ID",
  request: {
    params: idParamSchema,
  },
  responses: {
    "200": {
      description: "Route found",
      content: {
        "application/json": {
          schema: routeResponseSchema,
        },
      },
    },
    "404": {
      description: "Route not found",
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
  path: "/routes/{id}",
  tags: ["Routes"],
  summary: "Update route",
  request: {
    params: idParamSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateRouteRequestSchema,
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Updated route",
      content: {
        "application/json": {
          schema: routeResponseSchema,
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
      description: "Route not found",
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
  path: "/routes/{id}",
  tags: ["Routes"],
  summary: "Delete route",
  request: {
    params: idParamSchema,
  },
  responses: {
    "204": {
      description: "Route deleted",
    },
    "404": {
      description: "Route not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

const routeOpenApiDocument = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "Climb Log API - Routes",
    version: "1.0.0",
  },
});

export const routeOpenApiPaths = routeOpenApiDocument.paths;
export const routeOpenApiSchemas =
  routeOpenApiDocument.components?.schemas || {};
