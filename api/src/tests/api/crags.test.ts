import fs from "fs";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../app";
import { getTestDbPath } from "../../db/db";

describe("Crags API", () => {
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
    it("should create a crag", async () => {
      const response = await request(app).post("/crags").send({
        location_id: "loc_123",
        name: "Raven Tor",
        type: "outdoor",
      });

      expect(response.status).toBe(201);
      expect(response.body.location_id).toBe("loc_123");
      expect(response.body.name).toBe("Raven Tor");
      expect(response.body.type).toBe("outdoor");
      expect(response.body.created_at).toBeDefined();
      expect(new Date(response.body.created_at).toString()).not.toBe(
        "Invalid Date",
      );
    });

    it("should return 400 for missing location_id", async () => {
      const response = await request(app).post("/crags").send({
        name: "Raven Tor",
        type: "outdoor",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for missing name", async () => {
      const response = await request(app).post("/crags").send({
        location_id: "loc_123",
        type: "outdoor",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for invalid type", async () => {
      const response = await request(app).post("/crags").send({
        location_id: "loc_123",
        name: "Raven Tor",
        type: "gym",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("list", () => {
    it("should list crags", async () => {
      await request(app).post("/crags").send({
        location_id: "loc_123",
        name: "Raven Tor",
        type: "outdoor",
      });

      const response = await request(app).get("/crags");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("Raven Tor");
    });
  });

  describe("read", () => {
    it("should get crag by ID", async () => {
      const createResponse = await request(app).post("/crags").send({
        location_id: "loc_123",
        name: "Raven Tor",
        type: "outdoor",
      });

      const cragId = createResponse.body.id;

      const getResponse = await request(app).get(`/crags/${cragId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe("Raven Tor");
      expect(getResponse.body.location_id).toBe("loc_123");
    });

    it("should return 404 for invalid crag ID", async () => {
      const response = await request(app).get("/crags/invalid-id");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Crag not found");
    });
  });

  describe("update", () => {
    it("should update crag", async () => {
      const createResponse = await request(app).post("/crags").send({
        location_id: "loc_123",
        name: "Old Crag",
        type: "outdoor",
      });

      const cragId = createResponse.body.id;
      const createdAt = createResponse.body.created_at;

      const updateResponse = await request(app).patch(`/crags/${cragId}`).send({
        location_id: "loc_456",
        name: "New Crag",
        type: "indoor",
      });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.location_id).toBe("loc_456");
      expect(updateResponse.body.name).toBe("New Crag");
      expect(updateResponse.body.type).toBe("indoor");
      expect(updateResponse.body.created_at).toBe(createdAt);
    });

    it("should partially update a crag with patch", async () => {
      const createResponse = await request(app).post("/crags").send({
        location_id: "loc_123",
        name: "Original Crag",
        type: "outdoor",
      });

      const cragId = createResponse.body.id;
      const createdAt = createResponse.body.created_at;

      const updateResponse = await request(app).patch(`/crags/${cragId}`).send({
        name: "Renamed Crag",
      });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.location_id).toBe("loc_123");
      expect(updateResponse.body.name).toBe("Renamed Crag");
      expect(updateResponse.body.type).toBe("outdoor");
      expect(updateResponse.body.created_at).toBe(createdAt);
    });

    it("should return 404 when updating non-existent crag", async () => {
      const response = await request(app).patch("/crags/non-existent-id").send({
        location_id: "loc_456",
        name: "New Crag",
        type: "indoor",
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Crag not found");
    });
  });

  describe("delete", () => {
    it("should delete crag", async () => {
      const createResponse = await request(app).post("/crags").send({
        location_id: "loc_123",
        name: "Delete Me",
        type: "outdoor",
      });

      const cragId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/crags/${cragId}`);

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get(`/crags/${cragId}`);
      expect(getResponse.status).toBe(404);
      expect(getResponse.body.message).toBe("Crag not found");
    });

    it("should return 404 when deleting non-existent crag", async () => {
      const response = await request(app).delete("/crags/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Crag not found");
    });
  });
});
