import { DraftPlanData } from "../services/api";

import recipeData from "./recipeData";

const mealPlanData: DraftPlanData = {
  groups: [
    {
      items: [recipeData],
      label: "some-label"
    }
  ]
};

export default mealPlanData;
