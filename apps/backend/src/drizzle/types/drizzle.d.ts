import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "src/drizzle/schema";

export type DrizzleDB = NodePgDatabase<schema>;
