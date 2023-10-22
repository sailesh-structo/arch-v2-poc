import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';

// for query purposes
const queryClient = postgres(process.env.DB_CONNECTION_STRING);
const db: PostgresJsDatabase = drizzle(queryClient);

export default db;
