import "dotenv/config";

import { sql } from "drizzle-orm";
import { db } from ".";

// Purge Database
export async function purgeDatabase() {
  if (process.env.NODE_ENV === "production") return;
  if (
    process.env.DATABASE_URL &&
    typeof process.env.DATABASE_URL == "string" &&
    process.env.DATABASE_URL.includes("bitter-glitter")
  ) {
    console.warn(
      "You have targeted the production database, this operation must be done manually",
    );
    console.warn("\nAborting the purge process...\n");
    return;
  }

  // Drop all tables
  await db.execute(sql`DROP SCHEMA public CASCADE;`);
  await db.execute(sql`CREATE SCHEMA public;`);
}

purgeDatabase().catch((error) => {
  console.error(error);
});
