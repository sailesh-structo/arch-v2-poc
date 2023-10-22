import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';

// for query purposes
const queryClient = postgres('postgres://my_user:S3cret@0.0.0.0:5432/my_db');
const db: PostgresJsDatabase = drizzle(queryClient);

export default db;
