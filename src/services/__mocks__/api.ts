import mealPlanData from "../../__fixtures__/mealPlanData";
import recipeData from "../../__fixtures__/recipeData";

import { DraftPlanData, MealPlanData, RecipeData } from "../api";

exports.analyzeRecipe = jest.fn().mockImplementation(
  async (url: string): Promise<RecipeData> => {
    return {
      ...recipeData,
      url
    };
  }
);

exports.saveMealPlan = jest.fn().mockImplementation(
  async (plan: DraftPlanData): Promise<MealPlanData> => {
    return mealPlanData;
  }
);

exports.showMealPlan = jest.fn().mockImplementation(
  async (planId: string): Promise<MealPlanData | null> => {
    return {
      ...mealPlanData,
      id: planId
    };
  }
);
