// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.body = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights", async (ctx) => {
  // 1. Retrieve the JSON body from the incoming request, which should contain the brandId and text for the new insight
  const body = await ctx.request.body.json();

  // 2. Call the database insertion logic to create a new insight record in the database, passing the brandId and text from the request body
  const result = await createInsight({
    db: db,
    brandId: body.brandId,
    text: body.text,
  });

  // 3. Return the newly created insight to the client and set the status code to 201 (Created)
  ctx.response.body = result;
  ctx.response.status = 201;
});

router.delete("/insights/:id", async (ctx) => {
  // 1. Retrieve the insight ID from the URL parameters, which indicates which insight record should be deleted from the database
  const params = ctx.params as Record<string, string>;
  
  const insightId = parseInt(params.id, 10);

  // 2. Call the business logic to perform the deletion
  await deleteInsight({
    db: db,
    id: insightId,
  });

  // 3. Return a success status code 200 (OK) to indicate the operation was completed successfully
  ctx.response.status = 200;
  ctx.response.body = { message: "Insight deleted successfully" };
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
