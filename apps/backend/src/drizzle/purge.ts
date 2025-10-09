import 'dotenv/config';

import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';
import { sql } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: true,
});

export const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

// Purge Database
export async function purgeDatabase() {
  if (process.env.NODE_ENV === 'production') return;
  if (
    process.env.DATABASE_URL &&
    typeof process.env.DATABASE_URL == 'string' &&
    process.env.DATABASE_URL.includes('bitter-glitter')
  ) {
    console.warn(
      'You have targeted the production database, this operation must be done manually',
    );
    console.warn('\nAborting the purge process...\n');
    return;
  }

  // Drop all tables
  await db.execute(sql`DROP SCHEMA public CASCADE;`);
  await db.execute(sql`CREATE SCHEMA public;`);
}

purgeDatabase().catch((error) => {
  console.error(error);
});
