import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import migrator from "models/migrator.js";
import authorization from "models/authorization";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:migration"), getHandler);
router.post(controller.canRequest("create:migration"), postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
  const pendingMigrations = await migrator.listPendingMigrations();

  const secureOutputValue =
    (userTryingToGet, "read:migrations", pendingMigrations);

  return response.status(200).json(secureOutputValue);
}

async function postHandler(request, response) {
  const userTryingToPost = request.context.user;
  const migratedMigrations = await migrator.runPendingMigrations();

  const secureOutputValue = authorization.filterOutput(
    userTryingToPost,
    "read:migration",
    migratedMigrations,
  );

  if (migratedMigrations.length > 0) {
    return response.status(201).json(secureOutputValue);
  }

  return response.status(200).json(secureOutputValue);
}
