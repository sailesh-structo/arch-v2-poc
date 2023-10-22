import { pgTable, text, integer } from 'drizzle-orm/pg-core';

export const output = pgTable('output', {
  jobId: text('jobId').primaryKey().notNull(),
  status: integer('status').notNull(),
});
