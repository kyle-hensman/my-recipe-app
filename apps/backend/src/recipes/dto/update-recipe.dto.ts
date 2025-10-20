import { PartialType } from "@nestjs/swagger";
import { CreateRecipeDto } from "./create-recipe.dto";

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
  userId: string;
  title: string;
  image?: string;
  cookTime: string;
  servings: string;
  category?: string;
  area?: string;
  ingredients: string[];
  instructions: string[];
  versions?: string[];
  createdAt: Date;
  createdBy: string;
  updatedBy: string;
  updatedAt: Date;
}
