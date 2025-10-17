export class CreateFavoriteDto {
  userId: string;
  recipeId: number;
  title: string;
  image: string;
  cookTime: string;
  servings: string;
  createdAt: Date;
}
