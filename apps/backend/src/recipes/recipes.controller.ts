import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { ApiQuery } from "@nestjs/swagger";

@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    if (
      !createRecipeDto.userId ||
      !createRecipeDto.ingredients ||
      !createRecipeDto.instructions ||
      !createRecipeDto.title
    ) {
      throw new BadRequestException("Missing required fields");
    }

    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  @ApiQuery({
    name: "page",
    required: false,
    description: "Optional parameter",
  })
  @ApiQuery({
    name: "user",
    required: false,
    description: "Optional parameter",
  })
  findAll(@Query("page") page?: number, @Query("user") userId?: string) {
    if (userId) {
      return this.recipesService.findAllByUserId(page || 1, userId);
    }
    return this.recipesService.findAll(page || 1);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.recipesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.recipesService.remove(+id);
  }
}
