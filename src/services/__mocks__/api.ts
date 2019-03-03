import { MealPlanData, RecipeData } from "../api";

exports.analyzeRecipe = jest.fn().mockImplementation(async (url: string): Promise<RecipeData> => {
  return {
    image: "some-image",
    ingredients: ["some-ingredient"],
    instructions: ["some-instruction"],
    name: "some-name",
    nutrition: {
      perCalories: {
        CHOCDF: {
          quantity: 1,
          unit: "kcal",
        },
        FAT: {
          quantity: 1,
          unit: "kcal",
        },
        PROCNT: {
          quantity: 1,
          unit: "kcal",
        } ,
      },
      perDaily: {
        CHOCDF: {
          quantity: 1,
          unit: "%",
        },
        FAT: {
          quantity: 1,
          unit: "%",
        },
        PROCNT: {
          quantity: 1,
          unit: "%",
        } ,
      },
      perWeight: {
        CHOCDF: {
          quantity: 1,
          unit: "g",
        },
        FAT: {
          quantity: 1,
          unit: "g",
        },
        PROCNT: {
          quantity: 1,
          unit: "g",
        } ,
      },
      totalCalories: 4321,
      totalWeight: 1234,
    },
    servings: 2,
    url,
  };
});

exports.saveMealPlan = jest.fn().mockImplementation(async (recipes: RecipeData[]): Promise<MealPlanData> => {
  return {
    id: 1234,
    recipes: [],
  };
});

exports.showMealPlan = jest.fn().mockImplementation(async (planId: string): Promise<MealPlanData | null> => {
  return {
    id: 1234,
    recipes: [],
  };
});
