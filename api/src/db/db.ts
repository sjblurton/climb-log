import fs from "fs/promises";
import path from "path";
import { DatabaseSchema } from "./schemas/DatabaseSchema";

const DB_PATH = path.join(__dirname, "database.json");
const DB_PATH_TEST = path.join(__dirname, "database.test.json");
const DB_PATH_INIT = path.join(__dirname, "database.init.json");
const DB_PATH_POPULATED = path.join(__dirname, "database.populated.json");

export class Database {
  schema = new DatabaseSchema();

  private getDbPath() {
    console.log("Environment:", process.env["NODE_ENV"]);
    return process.env["NODE_ENV"] === "test" ? DB_PATH_TEST : DB_PATH;
  }

  private getDbPathForInit() {
    console.log("Environment:", process.env["NODE_ENV"]);
    return process.env["NODE_ENV"] === "test"
      ? DB_PATH_POPULATED
      : DB_PATH_INIT;
  }

  private async initialize() {
    try {
      await fs.access(this.getDbPath());
    } catch {
      console.log("Database file not found, creating new one...");
      const initData = await fs.readFile(this.getDbPathForInit(), "utf-8");
      const parsedInitData = this.schema.databaseSchema.parse(
        JSON.parse(initData),
      );
      await fs.writeFile(
        this.getDbPath(),
        JSON.stringify(parsedInitData, null, 2),
        "utf-8",
      );
    }
  }

  async read() {
    await this.initialize();
    const data = await fs.readFile(this.getDbPath(), "utf-8");
    const parsed = this.schema.databaseSchema.parse(JSON.parse(data));
    return parsed;
  }

  async write(data: unknown) {
    await this.initialize();
    const parsed = this.schema.databaseSchema.parse(data);
    const jsonString = JSON.stringify(parsed, null, 2);
    await fs.writeFile(this.getDbPath(), jsonString, "utf-8");
  }
}
