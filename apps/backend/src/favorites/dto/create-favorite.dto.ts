export class CreateFavoriteDto {
  userId: number;
  recipeId: number;
  title: string;
  image: string;
  cookTime: string;
  servings: string;
  createdAt: Date;
}
