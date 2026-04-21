import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("With `create:migration`", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });
      expect(response.status).toBe(403);

      const responseBoby = await response.json();

      expect(responseBoby).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action: `Verifique se o seu usuário possui a feature "create:migration"`,
        status_code: 403,
      });
    });
  });

  describe("Default user", () => {
    test("With `create:migration`", async () => {
      const createdUser = await orchestrator.createUser({});
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(403);

      const responseBoby = await response.json();

      expect(responseBoby).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action: `Verifique se o seu usuário possui a feature "create:migration"`,
        status_code: 403,
      });
    });
  });

  describe("Privileged user", () => {
    test("With `create:migration`", async () => {
      const createdUser = await orchestrator.createUser({});
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      await orchestrator.addFeaturesToUser(createdUser, ["create:migration"]);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBoby = await response.json();

      expect(Array.isArray(responseBoby)).toBe(true);
    });
  });
});
