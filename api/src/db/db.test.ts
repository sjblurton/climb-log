import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Database } from "./db";
import fs from "fs/promises";
import path from "path";

describe("Database", () => {
  const testDbPath = path.join(__dirname, "database.test.json");
  const testInitPath = path.join(__dirname, "database.init.json");

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(async () => {
    vi.unstubAllEnvs();

    await fs.unlink(testDbPath).catch();
  });

  it("should initialize database with init data if file doesn't exist", async () => {
    const db = new Database();
    const initData = {
      locations: [{ id: "1", name: "Test Crag" }],
      crags: [],
      routes: [],
      climbLogs: [],
    };

    await fs.writeFile(testInitPath, JSON.stringify(initData, null, 2));

    const result = await db.read();
    expect(result.locations).toBeDefined();
  });

  it("should read database file", async () => {
    const db = new Database();
    const testData = {
      locations: [{ id: "1", name: "Test Crag" }],
      crags: [],
      routes: [],
      climbLogs: [],
    };

    await fs.writeFile(testDbPath, JSON.stringify(testData, null, 2));
    const result = await db.read();

    expect(result.locations).toHaveLength(1);
    expect(result.locations[0].name).toBe("Test Crag");
  });

  it("should write database file", async () => {
    const db = new Database();
    const testData = {
      locations: [{ id: "1", name: "Test Crag" }],
      crags: [],
      routes: [],
      climbLogs: [],
    };

    await db.write(testData);
    const content = await fs.readFile(testDbPath, "utf-8");
    const parsed = JSON.parse(content);

    expect(parsed.locations).toHaveLength(1);
    expect(parsed.locations[0].name).toBe("Test Crag");
  });
});

describe("Test production path", () => {
  it("getDbPath should return production path when NODE_ENV is not test", () => {
    const db = new Database();
    process.env.NODE_ENV = "production";

    const pathResult = (
      db as unknown as { getDbPath: () => string }
    ).getDbPath();
    const expected = path.join(__dirname, "database.json");
    expect(pathResult).toBe(expected);
  });
});
