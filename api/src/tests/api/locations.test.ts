import request from "supertest";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import app from "../../app";
import fs from "fs";
import { getTestDbPath } from "../../db/db";

describe("Locations API", () => {
  const dbPath = getTestDbPath();

  beforeEach(async () => {
    const initData = {
      locations: [],
      crags: [],
      routes: [],
      climbLogs: [],
    };
    fs.writeFileSync(dbPath, JSON.stringify(initData, null, 2));
  });

  afterAll(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  describe("create", () => {
    it("should create a location", async () => {
      const response = await request(app)
        .post("/locations")
        .send({ name: "The Depot Manchester" });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("The Depot Manchester");
    });

    it("should return 400 for invalid location creation", async () => {
      const response = await request(app).post("/locations").send({ name: "" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for missing name field", async () => {
      const response = await request(app).post("/locations").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for non-string name", async () => {
      const response = await request(app)
        .post("/locations")
        .send({ name: 123 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("list", () => {
    it("should list locations", async () => {
      await request(app).post("/locations").send({ name: "Test Location" });

      const response = await request(app).get("/locations");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe("Test Location");
    });
  });

  describe("read", () => {
    it("should get location by ID", async () => {
      const createResponse = await request(app)
        .post("/locations")
        .send({ name: "Test Location" });

      const locationId = createResponse.body.id;

      const getResponse = await request(app).get(`/locations/${locationId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe("Test Location");
    });

    it("should return 404 for invalid location ID", async () => {
      const response = await request(app).get("/locations/invalid-id");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Location not found");
    });

    it("should return a 404 for an array location id get request", async () => {
      const params = new URLSearchParams();
      params.append("id", "loc_123");
      params.append("id", "loc_456");

      const response = await request(app).get(
        `/locations/${params.toString()}`,
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Location not found");
    });
  });

  describe("update", () => {
    it("should update location", async () => {
      const createResponse = await request(app)
        .post("/locations")
        .send({ name: "Old Name" });

      const locationId = createResponse.body.id;

      const updateResponse = await request(app)
        .patch(`/locations/${locationId}`)
        .send({ name: "New Name" });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.name).toBe("New Name");

      const getResponse = await request(app).get(`/locations/${locationId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe("New Name");
    });

    it("should return 404 when updating non-existent location", async () => {
      const response = await request(app)
        .patch("/locations/non-existent-id")
        .send({ name: "New Name" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Location not found");
    });

    it("should return a 404 for an array location id update request", async () => {
      const params = new URLSearchParams();
      params.append("id", "loc_123");
      params.append("id", "loc_456");

      const response = await request(app)
        .patch(`/locations/${params.toString()}`)
        .send({ name: "New Name" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Location not found");
    });
  });

  describe("delete", () => {
    it("should delete location", async () => {
      const createResponse = await request(app)
        .post("/locations")
        .send({ name: "Delete Me" });

      const locationId = createResponse.body.id;

      const deleteResponse = await request(app).delete(
        `/locations/${locationId}`,
      );

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get(`/locations/${locationId}`);
      expect(getResponse.status).toBe(404);
      expect(getResponse.body.message).toBe("Location not found");
    });

    it("should return 404 when deleting non-existent location", async () => {
      const response = await request(app).delete("/locations/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Location not found");
    });

    it("should return a 404 for an array location id delete request", async () => {
      const params = new URLSearchParams();
      params.append("id", "loc_123");
      params.append("id", "loc_456");

      const response = await request(app).delete(
        `/locations/${params.toString()}`,
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Location not found");
    });
  });
});
