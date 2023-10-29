// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { pgTable, text, integer } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const output = pgTable("output", {
  jobId: text("jobId").primaryKey().notNull(),
  status: integer("status").notNull(),
  timestamp: integer("timestamp").notNull(),
  machineId: text("machineId").notNull(),
});
