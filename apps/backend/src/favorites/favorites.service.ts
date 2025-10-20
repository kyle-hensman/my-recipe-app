import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { UpdateFavoriteDto } from "./dto/update-favorite.dto";
import { DRIZZLE } from "../drizzle/drizzle.module";
import { type DrizzleDB } from "../drizzle/types/drizzle";
import { favorites } from "../drizzle/schema";
import { ServiceResponseDto } from "../common/types/service-response.dto";
import { Favorite } from "./entities/favorite.entity";

const favoritesPerPage = 10;

@Injectable()
export class FavoritesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<ServiceResponseDto<Favorite>> {
    try {
      const results = await this.db
        .insert(favorites)
        .values(createFavoriteDto)
        .returning();

      if (!results) {
        return {
          success: false,
          error: Error(
            `There was an issue creating the new favorite for user ${createFavoriteDto.userId}`,
          ),
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: results[0],
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: Error(
          `There was an issue creating the new favorite for user ${createFavoriteDto.userId}`,
        ),
        data: null,
      };
    }
  }

  async findAll(
    page: number | undefined = 1,
  ): Promise<ServiceResponseDto<Favorite[]>> {
    try {
      const foundFavoritesCount = await this.db.$count(favorites);
      const foundFavorites = await this.db
        .select()
        .from(favorites)
        .limit(favoritesPerPage)
        .offset(favoritesPerPage * (page - 1));

      if (!foundFavorites) {
        return {
          success: false,
          error: Error("No favorites found"),
          data: null,
          page: page,
          count: 0,
          total: 0,
        };
      }

      return {
        success: true,
        error: null,
        data: foundFavorites,
        page: page,
        count: foundFavorites.length,
        total: foundFavoritesCount,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: Error("Error getting all favorites"),
        data: null,
        page: page,
        count: 0,
        total: 0,
      };
    }
  }

  async findOne(favoriteId: number): Promise<ServiceResponseDto<Favorite>> {
    try {
      const foundFavorites = await this.db
        .select()
        .from(favorites)
        .where(eq(favorites.id, favoriteId));

      if (!foundFavorites) {
        return {
          success: false,
          error: Error(`No favorite found with the id ${favoriteId}`),
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: foundFavorites[0],
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: Error(`Error getting favorite with id ${favoriteId}`),
        data: null,
      };
    }
  }

  async findAllByUserId(
    page: number,
    userId: string,
  ): Promise<ServiceResponseDto<Favorite[]>> {
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

      if (!foundFavorites) {
        return {
          success: false,
          error: Error(`No favorites found with the userid ${userId}`),
          data: null,
          page: page,
          count: 0,
        };
      }

      return {
        success: true,
        error: null,
        data: foundFavorites,
        page: page,
        count: totalFavorites.length,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: Error(`Error getting favorite for user ${userId}`),
        data: null,
        page: page,
        count: 0,
      };
    }
  }

  async update(
    id: number,
    updateFavoriteDto: UpdateFavoriteDto,
  ): Promise<ServiceResponseDto<Favorite>> {
    try {
      const results = await this.db
        .update(favorites)
        .set(updateFavoriteDto)
        .where(eq(favorites.id, id))
        .returning();

      if (!results) {
        return {
          success: false,
          error: Error(`Issue updating favorite with id ${id}`),
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: results[0],
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: Error(`Error updating favorite with id ${id}`),
        data: null,
      };
    }
  }

  async remove(id: number): Promise<ServiceResponseDto<Favorite>> {
    try {
      const results = await this.db
        .delete(favorites)
        .where(eq(favorites.id, id))
        .returning();

      if (!results) {
        return {
          success: false,
          error: Error(`Issue deleting favorite with id ${id}`),
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: results[0],
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: Error(`Error deleting favorite with id ${id}`),
        data: null,
      };
    }
  }
}
