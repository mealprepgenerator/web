import mealPlanData from "../../__fixtures__/mealPlanData";
import recipeData from "../../__fixtures__/recipeData";

import { MealPlanData, RecipeData } from "../api";

exports.analyzeRecipe = jest.fn().mockImplementation(async (url: string): Promise<RecipeData> => {
  return {
    ...recipeData,
    url,
  };
});

exports.saveMealPlan = jest.fn().mockImplementation(async (recipes: RecipeData[]): Promise<MealPlanData> => {
  return {
    ...mealPlanData,
    recipes: recipes.map((r) => ({
      recipeUrl: r.url,
      servings: r.servings,
    })),
  };
});

exports.showMealPlan = jest.fn().mockImplementation(async (planId: string): Promise<MealPlanData | null> => {
  return {
    ...mealPlanData,
    id: planId,
  };
});
