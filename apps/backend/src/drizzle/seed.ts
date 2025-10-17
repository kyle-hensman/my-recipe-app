import "dotenv/config";

import { faker } from "@faker-js/faker";
import { User } from "better-auth";

import * as schema from "./schema";
import { db } from ".";
import { auth } from "../auth";

let listOfUsers: User[] = [];

// // Seed Users
async function seedUsers(numberOfUsers: number = 2) {
  const userIds = await Promise.all(
    Array(numberOfUsers)
      .fill("")
      .map(async () => {
        const results = await auth.api.signUpEmail({
          body: {
            name: `${faker.person.firstName()} ${faker.person.lastName()}`,
            email: faker.internet.email(),
            password: `${faker.word.adjective()}_fake_${faker.word.adjective()}`,
          },
        });

        const user = results.user;
        listOfUsers.push(user);
        return user;
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
        .fill("")
        .map(async () => {
          const favorite = await db
            .insert(schema.favorites)
            .values({
              userId: user.id,
              recipeId: new Date().getMilliseconds(),
              title: faker.word.noun(),
              image: null,
              cookTime: `${faker.number.int({ min: 1, max: 4 })}:${faker.number.int({ min: 0, max: 60, multipleOf: 10 })}`,
              servings: `${faker.number.int({ min: 1, max: 4 })} to ${faker.number.int({ min: 6, max: 12 })}`,
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
