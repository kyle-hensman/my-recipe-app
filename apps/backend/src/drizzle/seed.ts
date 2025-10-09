import 'dotenv/config';

import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';

import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: true,
});

export const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

let listOfUsers: {
  id: number;
  name: string;
  email: string;
  password: string;
}[] = [];

// Seed Users
async function seedUsers(numberOfUsers: number = 2) {
  const userIds = await Promise.all(
    Array(numberOfUsers)
      .fill('')
      .map(async () => {
        const user = await db
          .insert(schema.users)
          .values({
            email: faker.internet.email(),
            name: `${faker.person.firstName()} ${faker.person.lastName()}`,
            password: 'password',
          })
          .returning();
        listOfUsers.push(user[0]);
        return user[0].id;
      }),
  );

  if (userIds && userIds.length > 0) {
    console.log(
      `~~ ${userIds.length} users added to the database successfully ~~`,
    );
  } else {
    console.log(`~!~ failed to add ${userIds.length} users to the database ~~`);
  }

  return Promise.resolve();
}

// Seed Favorites
async function seedFavorites(numberOfFavorites: number = 3) {
  let favoriteIds: number[] = [];

  for (const user of listOfUsers) {
    await Promise.all(
      Array(numberOfFavorites)
        .fill('')
        .map(async () => {
          const favorite = await db
            .insert(schema.favorites)
            .values({
              userId: user.id,
              recipeId: user.id * new Date().getMilliseconds() * 2,
              title: faker.word.noun(),
              image: null,
              cookTime: `${user.id + 1} hours`,
              servings: `${user.id + 1} - ${user.id + 2} servings`,
              createdAt: new Date(),
            })
            .returning();
          favoriteIds.push(favorite[0].id);
          return favorite[0].id;
        }),
    );
  }

  if (favoriteIds && favoriteIds.length > 0) {
    console.log(
      `~~ ${favoriteIds.length} favorites added to the database successfully ~~`,
    );
  } else {
    console.log(
      `~!~ failed to add ${favoriteIds.length} favorites to the database ~~`,
    );
  }

  favoriteIds = []; // reset the array to avoid memory leaks
  return Promise.resolve();
}

async function main() {
  try {
    // seed fake users
    await seedUsers(5);
    // seed fake favorites
    await seedFavorites();
  } catch (error) {
    console.error(error);
  } finally {
    listOfUsers = []; // release list of users to avoid memory leaks
  }
}

main().catch((error) => {
  console.error(error);
  listOfUsers = []; // release list of users to avoid memory leaks
});
