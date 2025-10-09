import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { type DrizzleDB } from '../drizzle/types/drizzle';
import { favorites } from '../drizzle/schema';

const favoritesPerPage = 10;

@Injectable()
export class FavoritesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    try {
      const results = await this.db
        .insert(favorites)
        .values(createFavoriteDto)
        .returning();

      if (results) {
        return {
          success: true,
          error: null,
          data: results[0],
        };
      } else {
        return {
          success: false,
          error: `There was an issue creating the new favorite for user ${createFavoriteDto.userId}`,
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(page: number | undefined = 1) {
    try {
      const foundFavorites = await this.db
        .select()
        .from(favorites)
        .limit(favoritesPerPage)
        .offset(favoritesPerPage * (page - 1));

      if (foundFavorites) {
        return {
          success: true,
          page: page,
          count: foundFavorites.length,
          data: foundFavorites,
        };
      } else {
        return {
          success: false,
          page: page,
          count: 0,
          error: 'No favorites found',
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(favoriteId: number) {
    try {
      const foundFavorites = await this.db
        .select()
        .from(favorites)
        .where(eq(favorites.id, favoriteId));

      if (foundFavorites) {
        return {
          success: true,
          error: null,
          data: foundFavorites[0],
        };
      } else {
        return {
          success: false,
          error: `No favorites found with the id ${favoriteId}`,
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async findAllByUserId(page: number, userId: number) {
    try {
      const totalFavorites = await this.db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, userId));
      const foundFavorites = await this.db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, userId))
        .limit(favoritesPerPage)
        .offset(favoritesPerPage * (page - 1));

      if (foundFavorites) {
        return {
          success: true,
          page: page,
          count: totalFavorites.length,
          error: null,
          data: foundFavorites,
        };
      } else {
        return {
          success: false,
          page: page,
          count: 0,
          error: `No favorites found with the userid ${userId}`,
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    try {
      const results = await this.db
        .update(favorites)
        .set(updateFavoriteDto)
        .where(eq(favorites.id, id))
        .returning();

      if (results) {
        return {
          success: true,
          error: null,
          data: results[0],
        };
      } else {
        return {
          success: false,
          error: `There was an issue updating favorite ${id}`,
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: number) {
    try {
      const results = await this.db
        .delete(favorites)
        .where(eq(favorites.id, id))
        .returning();

      if (results) {
        return {
          success: true,
          error: null,
          data: results[0],
        };
      } else {
        return {
          success: false,
          error: `There was an issue deleting favorite ${id}`,
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }
}
