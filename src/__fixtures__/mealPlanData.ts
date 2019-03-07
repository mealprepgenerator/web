import { MealPlanData } from "../services/api";

const mealPlanData: MealPlanData = {
  groups: [
    {
      id: 1234,
      items: [
        {
          id: 4321,
          recipeUrl: "some-valid-recipe-url",
          servings: 1
        }
      ],
      label: "some-label"
    }
  ],
  id: "1234"
};

export default mealPlanData;
