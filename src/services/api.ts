import { apiUrl } from "../config";

export interface MealPlanData {
  id: string;
  recipes: MealPlanRecipe[];
}

export interface MealPlanRecipe {
  servings: number;
  recipeUrl: string;
}

export interface RecipeData {
  url: string;
  name: string;
  image: string;
  servings: number;
  nutrition: NutritionData;
  ingredients: string[];
  instructions: string[];
}

export interface NutritionData {
  perDaily: NutrientData;
  perWeight: NutrientData;
  perCalories: NutrientData;
  totalWeight: number;
  totalCalories: number;
}

export interface NutrientData {
  [code: string]: {
    unit: string;
    quantity: number;
  };
}

export async function analyzeRecipe(url: string): Promise<RecipeData> {
  const recipeUrl = encodeURIComponent(url);
  const response = await fetch(`${apiUrl}/analyze?recipeUrl=${recipeUrl}`);

  if (!response.ok) {
    throw new Error("Could not analyze the given recipe");
  }

  return response.json();
}

export async function saveMealPlan(recipes: RecipeData[]): Promise<MealPlanData> {
  const response = await fetch(`${apiUrl}/plans`, {
    body: JSON.stringify({
      recipes: recipes.map((r) => ({
        recipeUrl: r.url,
        servings: r.servings,
      })),
    }),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Could not save the given meal plan");
  }

  return response.json();
}

export async function showMealPlan(planId: string): Promise<MealPlanData | null> {
  const response = await fetch(`${apiUrl}/plans/${planId}`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}
