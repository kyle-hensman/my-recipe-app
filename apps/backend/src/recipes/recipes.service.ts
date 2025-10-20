import { Inject, Injectable } from "@nestjs/common";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { type DrizzleDB } from "src/drizzle/types/drizzle";
import { recipes } from "src/drizzle/schema";
import { ServiceResponseDto } from "src/common/types/service-response.dto";
import { Recipe } from "./entities/recipe.entity";
import { eq } from "drizzle-orm";

const recipesPerPage = 10;

@Injectable()
export class RecipesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(
    createRecipeDto: CreateRecipeDto,
  ): Promise<ServiceResponseDto<Recipe>> {
    try {
      const results = await this.db
        .insert(recipes)
        .values(createRecipeDto)
        .returning();

      if (!results) {
        return {
          success: false,
          error: Error(
            `There was an issue creating the new recipe for user ${createRecipeDto.userId}`,
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
          `There was an issue creating the new recipe for user ${createRecipeDto.userId}`,
        ),
        data: null,
      };
    }
  }

  async findAll(
    page: number | undefined = 1,
  ): Promise<ServiceResponseDto<Recipe[]>> {
    try {
      const foundRecipesCount = await this.db.$count(recipes);
      const foundRecipes = await this.db
        .select()
        .from(recipes)
        .limit(recipesPerPage)
        .offset(recipesPerPage * (page - 1));

      if (!foundRecipes) {
        return {
          success: false,
          error: Error("No recipes found"),
          data: null,
          page: page,
          count: 0,
          total: 0,
        };
      }

      return {
        success: true,
        error: null,
        data: foundRecipes,
        page: page,
        count: foundRecipes.length,
        total: foundRecipesCount,
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

  async findOne(recipeId: number): Promise<ServiceResponseDto<Recipe>> {
    try {
      const foundRecipe = await this.db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId));

      if (!foundRecipe) {
        return {
          success: false,
          error: Error(`No recipe found with the id ${recipeId}`),
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: foundRecipe[0],
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: Error(`Error getting recipe with id ${recipeId}`),
        data: null,
      };
    }
  }

  async findAllByUserId(
    page: number,
    userId: string,
  ): Promise<ServiceResponseDto<Recipe[]>> {
    try {
      const foundRecipesTotal = await this.db
        .select()
        .from(recipes)
        .where(eq(recipes.userId, userId));
      const foundRecipes = await this.db
        .select()
        .from(recipes)
        .where(eq(recipes.userId, userId))
        .limit(recipesPerPage)
        .offset(recipesPerPage * (page - 1));

      if (!foundRecipes) {
        return {
          success: false,
          error: Error(`No recipes found with the userid ${userId}`),
          data: null,
          page: page,
          count: 0,
        };
      }

      return {
        success: true,
        error: null,
        data: foundRecipes,
        page: page,
        count: foundRecipes.length,
        total: foundRecipesTotal.length,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: Error(`Error getting recipe for user ${userId}`),
        data: null,
        page: page,
        count: 0,
        total: 0,
      };
    }
  }

  async update(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
  ): Promise<ServiceResponseDto<Recipe>> {
    try {
      const results = await this.db
        .update(recipes)
        .set(updateRecipeDto)
        .where(eq(recipes.id, id))
        .returning();

      if (!results) {
        return {
          success: false,
          error: Error(`Issue updating recipe with id ${id}`),
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
        error: Error(`Error updating recipe with id ${id}`),
        data: null,
      };
    }
  }

  async remove(id: number): Promise<ServiceResponseDto<Recipe>> {
    try {
      const results = await this.db
        .delete(recipes)
        .where(eq(recipes.id, id))
        .returning();

      if (!results) {
        return {
          success: false,
          error: Error(`Issue deleting recipe with id ${id}`),
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
        error: Error(`Error deleting recipe with id ${id}`),
        data: null,
      };
    }
  }
}
