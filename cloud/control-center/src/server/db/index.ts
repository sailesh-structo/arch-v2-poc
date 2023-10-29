/* eslint-disable @typescript-eslint/no-unsafe-call */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env.mjs";
import * as schema from "./schema";

// for query purposes
export const db = drizzle(postgres(env.DATABASE_URL), {
  schema,
});

export default db;
