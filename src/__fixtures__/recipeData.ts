import { RecipeData } from "../services/api";

const recipeData: RecipeData = {
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
      },
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
      },
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
      },
    },
    totalCalories: 4321,
    totalWeight: 1234,
  },
  servings: 2,
  url: "some-valid-url",
};

export default recipeData;
