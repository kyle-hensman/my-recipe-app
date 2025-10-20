export class ExtractedRecipeDto {
  title: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  rawText: string;
  confidence?: number;
}
