import { sql } from "drizzle-orm";
import { text, timestamp, integer, serial, pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  recipeId: integer("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: text("servings"),
  category: text("category"),
  area: text("area"),
  ingredients: text("ingredients")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  instructions: text("instructions")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  versions: text("versions") // when another users 'edits', generate new id
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
