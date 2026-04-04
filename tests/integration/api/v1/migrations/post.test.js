import database from "infra/database.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllService();
  await database.query("drop schema public cascade; create schema public;");
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response1.status).toBe(201);

        const response1Boby = await response1.json();

        expect(Array.isArray(response1Boby)).toBe(true);
        expect(response1Boby.length).toBeGreaterThan(0);
      });

      test("For the Second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2.status).toBe(200);

        const response2Boby = await response2.json();

        expect(Array.isArray(response2Boby)).toBe(true);
        expect(response2Boby.length).toBe(0);
      });
    });
  });
});
