import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../app";

describe("Swagger docs", () => {
  it("should expose OpenAPI JSON", async () => {
    const response = await request(app).get("/docs.json");

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.info?.title).toBe("Climb Log API");
  });

  it("should expose Swagger UI", async () => {
    const response = await request(app).get("/docs/");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
  });
});