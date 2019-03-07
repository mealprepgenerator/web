import { apiUrl } from "../config";

export interface DraftPlanData {
  groups: DraftGroupData[];
}

export interface DraftGroupData {
  label: string;
  items: RecipeData[];
}

export interface MealPlanData {
  id: string;
  groups: MealGroupData[];
}

export interface MealPlanItem {
  id: number;
  servings: number;
  recipeUrl: string;
}

export interface MealGroupData {
  id: number;
  label: string;
  items: MealPlanItem[];
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

export async function saveMealPlan(plan: DraftPlanData): Promise<MealPlanData> {
  const response = await fetch(`${apiUrl}/plans`, {
    body: JSON.stringify({
      ...plan,
      groups: plan.groups.map(g => ({
        ...g,
        items: g.items.map(i => ({
          recipeUrl: i.url,
          servings: i.servings
        }))
      }))
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Could not save the given meal plan");
  }

  return response.json();
}

export async function showMealPlan(
  planId: string
): Promise<MealPlanData | null> {
  const response = await fetch(`${apiUrl}/plans/${planId}`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}
