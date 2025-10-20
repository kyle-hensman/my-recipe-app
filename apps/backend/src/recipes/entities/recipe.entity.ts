export class Recipe {
  id: number;
  userId: string;
  title: string;
  image: string | null;
  cookTime: string | null;
  servings: string | null;
  category: string | null;
  area: string | null;
  ingredients: string[];
  instructions: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  versions: string[] | null;
}
