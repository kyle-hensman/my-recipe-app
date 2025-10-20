export class CreateFavoriteDto {
  userId: string;
  recipeId: number;
  title: string;
  image: string | undefined;
  cookTime: string;
  servings: string;
  createdAt: Date;
}
