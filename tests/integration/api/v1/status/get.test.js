import orchestrator from "tests/orchestrator";

beforeAll(async()=> {
  await orchestrator.waitForAllService();
})


test("GET to /api/v1/status shoud return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  // return 200
  expect(response.status).toBe(200);
  // updated time defined
  const responseBody = await response.json();

  const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdateAt);

  //version database defined
  expect(responseBody.dependencies.database.version).toEqual("16.0");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
