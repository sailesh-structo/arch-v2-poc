import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from '../migrations/schema';

// for query purposes
const queryClient = postgres(process.env.DB_CONNECTION_STRING);
const db = drizzle(queryClient, { schema });

export default db;
