export class Favorite {
  id: number;
  userId: string;
  recipeId: number;
  title: string;
  image: string | null;
  cookTime: string | null;
  servings: string | null;
  createdAt: Date | null;
}
