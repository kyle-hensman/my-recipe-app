export class CreateRecipeDto {
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
