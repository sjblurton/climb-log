import fs from "fs";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../app";
import { getTestDbPath } from "../../db/db";

describe("Routes API", () => {
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
    it("should create a route", async () => {
      const response = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Blue Slab",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 4,
      });

      expect(response.status).toBe(201);
      expect(response.body.crag_id).toBe("crag_123");
      expect(response.body.name).toBe("Blue Slab");
      expect(response.body.climb_type).toBe("lead");
      expect(response.body.grade_type).toBe("yds");
      expect(response.body.grade_value).toBe(4);
      expect(response.body.grade_label).toBe("5.10a");
      expect(response.body.is_active).toBe(true);
      expect(response.body.created_at).toBeDefined();
      expect(new Date(response.body.created_at).toString()).not.toBe(
        "Invalid Date",
      );
      expect(response.body.updated_at).toBeDefined();
      expect(new Date(response.body.updated_at).toString()).not.toBe(
        "Invalid Date",
      );
      expect(response.body.updated_at).toBe(response.body.created_at);
    });

    it("should ignore is_active in create body and default to true", async () => {
      const response = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Moon Board Arete",
        climb_type: "boulder",
        grade_type: "font",
        grade_value: 7,
        is_active: false,
      });

      expect(response.status).toBe(201);
      expect(response.body.is_active).toBe(true);
      expect(response.body.grade_label).toBe("6B");
    });

    it("should return 400 for missing crag_id", async () => {
      const response = await request(app).post("/routes").send({
        name: "Blue Slab",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 4,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for missing name", async () => {
      const response = await request(app).post("/routes").send({
        crag_id: "crag_123",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 4,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for invalid climb_type", async () => {
      const response = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Blue Slab",
        climb_type: "trad",
        grade_type: "yds",
        grade_value: 4,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for invalid grade_type", async () => {
      const response = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Blue Slab",
        climb_type: "lead",
        grade_type: "vscale",
        grade_value: 4,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for non-number grade_value", async () => {
      const response = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Blue Slab",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: "10.6",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for non-integer grade_value", async () => {
      const response = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Blue Slab",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 10.6,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should use climb_type in grade label mapping", async () => {
      const boulderResponse = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Boulder YDS Example",
        climb_type: "boulder",
        grade_type: "yds",
        grade_value: 0,
      });

      const leadResponse = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Lead YDS Example",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 0,
      });

      const leadFontResponse = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Lead Font Example",
        climb_type: "lead",
        grade_type: "font",
        grade_value: 7,
      });

      expect(boulderResponse.status).toBe(201);
      expect(boulderResponse.body.grade_label).toBe("IV+");

      expect(leadResponse.status).toBe(201);
      expect(leadResponse.body.grade_label).toBe("5.6");

      expect(leadFontResponse.status).toBe(201);
      expect(leadFontResponse.body.grade_label).toBe("6B");
    });
  });

  describe("list", () => {
    it("should list routes including active and inactive", async () => {
      const firstCreate = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Blue Slab",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 4,
      });

      await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Red Roof",
        climb_type: "boulder",
        grade_type: "font",
        grade_value: 7,
      });

      await request(app)
        .patch(`/routes/${firstCreate.body.id}`)
        .send({ is_active: false });

      const response = await request(app).get("/routes");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(
        response.body.some((route: { is_active: boolean }) => route.is_active),
      ).toBe(true);
      expect(
        response.body.some((route: { is_active: boolean }) => !route.is_active),
      ).toBe(true);
      expect(
        response.body.every(
          (route: { grade_label?: string }) => !!route.grade_label,
        ),
      ).toBe(true);
    });
  });

  describe("read", () => {
    it("should get route by ID", async () => {
      const createResponse = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Blue Slab",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 4,
      });

      const routeId = createResponse.body.id;

      const getResponse = await request(app).get(`/routes/${routeId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe("Blue Slab");
      expect(getResponse.body.crag_id).toBe("crag_123");
      expect(getResponse.body.is_active).toBe(true);
      expect(getResponse.body.grade_label).toBe("5.10a");
    });

    it("should return 404 for invalid route ID", async () => {
      const response = await request(app).get("/routes/invalid-id");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Route not found");
    });
  });

  describe("update", () => {
    it("should update route", async () => {
      const createResponse = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Blue Slab",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 4,
      });

      const routeId = createResponse.body.id;
      const createdAt = createResponse.body.created_at;
      const originalUpdatedAt = createResponse.body.updated_at;

      const updateResponse = await request(app)
        .patch(`/routes/${routeId}`)
        .send({
          crag_id: "crag_456",
          name: "Blue Slab Direct",
          climb_type: "boulder",
          grade_type: "font",
          grade_value: 7,
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.crag_id).toBe("crag_456");
      expect(updateResponse.body.name).toBe("Blue Slab Direct");
      expect(updateResponse.body.climb_type).toBe("boulder");
      expect(updateResponse.body.grade_type).toBe("font");
      expect(updateResponse.body.grade_value).toBe(7);
      expect(updateResponse.body.grade_label).toBe("6B");
      expect(updateResponse.body.is_active).toBe(true);
      expect(updateResponse.body.created_at).toBe(createdAt);
      expect(new Date(updateResponse.body.updated_at).toString()).not.toBe(
        "Invalid Date",
      );
      expect(Date.parse(updateResponse.body.updated_at)).toBeGreaterThanOrEqual(
        Date.parse(originalUpdatedAt),
      );
    });

    it("should deactivate and reactivate a route", async () => {
      const createResponse = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Gym Reset Candidate",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 5,
      });

      const routeId = createResponse.body.id;
      const createdAt = createResponse.body.created_at;
      const originalUpdatedAt = createResponse.body.updated_at;

      const deactivateResponse = await request(app)
        .patch(`/routes/${routeId}`)
        .send({ is_active: false });

      expect(deactivateResponse.status).toBe(200);
      expect(deactivateResponse.body.is_active).toBe(false);
      expect(deactivateResponse.body.created_at).toBe(createdAt);
      expect(
        Date.parse(deactivateResponse.body.updated_at),
      ).toBeGreaterThanOrEqual(Date.parse(originalUpdatedAt));

      const reactivateResponse = await request(app)
        .patch(`/routes/${routeId}`)
        .send({ is_active: true });

      expect(reactivateResponse.status).toBe(200);
      expect(reactivateResponse.body.is_active).toBe(true);
      expect(reactivateResponse.body.created_at).toBe(createdAt);
      expect(
        Date.parse(reactivateResponse.body.updated_at),
      ).toBeGreaterThanOrEqual(Date.parse(deactivateResponse.body.updated_at));
    });

    it("should return 404 when updating non-existent route", async () => {
      const response = await request(app)
        .patch("/routes/non-existent-id")
        .send({
          name: "Updated Name",
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Route not found");
    });
  });

  describe("delete", () => {
    it("should delete route", async () => {
      const createResponse = await request(app).post("/routes").send({
        crag_id: "crag_123",
        name: "Delete Me",
        climb_type: "lead",
        grade_type: "yds",
        grade_value: 6,
      });

      const routeId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/routes/${routeId}`);

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get(`/routes/${routeId}`);
      expect(getResponse.status).toBe(404);
      expect(getResponse.body.message).toBe("Route not found");
    });

    it("should return 404 when deleting non-existent route", async () => {
      const response = await request(app).delete("/routes/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Route not found");
    });
  });
});
