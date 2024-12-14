import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/utils/db/schema";

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the database connection
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
