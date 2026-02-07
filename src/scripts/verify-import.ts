import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { count } from 'drizzle-orm';
import * as schema from "../db/schema/payload-generated-schema";
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const verifyImport = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  try {
    const res = await db.select({ value: count() }).from(schema.coffee_shops);
    console.log(`Verification: Total coffee shops in database: ${res[0].value}`);
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await pool.end();
  }
};

verifyImport();
