import parseFraction from "parse-fraction";
import wordsToNumbers from "words-to-numbers";

import { NutrientData, RecipeData } from "../Recipe";

const integerRegex = "[1-9]\\d*";
const decimalRegex = `${integerRegex}(\\.\\d+)?`;
const fractionRegex = `(${integerRegex} )?(${integerRegex})\\/(${integerRegex})`;
const everyNumRegex = new RegExp(`(${fractionRegex})|(${decimalRegex})`, "g");

const wordFractions: Replacer[] = [
  {from: /halfs?/g, to: "1/2"},
  {from: /thirds?/g, to: "1/3"},
  {from: /fourths?/g, to: "1/4"},
  {from: /quarters?/g, to: "1/4"},
  {from: /fifths?/g, to: "1/5"},
  {from: /sixths?/g, to: "1/6"},
  {from: /sevenths?/g, to: "1/7"},
  {from: /eighths?/g, to: "1/8"},
  {from: /ninths?/g, to: "1/9"},
  {from: /tenths?/g, to: "1/10"},
];

interface Replacer {
  from: string | RegExp;
  to: string;
}

function reduceReplacers(initial: string, replacers: Replacer[]) {
  return replacers.reduce(
    (acc: string, replacer) => acc.replace(replacer.from, replacer.to),
    initial,
  );
}

function resolveWords(ingredient: string) {
  return reduceReplacers(String(wordsToNumbers(ingredient)), wordFractions);
}

function scaleNumbers(ingredient: string, multiplier: number) {
  const matches = resolveWords(ingredient).match(everyNumRegex) || [];

  const replacers = matches
    .map((match) => parseFraction(match))
    .map(([numer, denom], index) => ({
      from: matches[index],
      to: parseFloat((numer * multiplier / denom).toFixed(3)).toString(),
    }));

  return reduceReplacers(ingredient, replacers);
}

export function scaleIngredients(ingredients: string[], multiplier: number): string[] {
  if (multiplier === 1) {
    return ingredients;
  }

  return ingredients.map((ingredient) => scaleNumbers(ingredient, multiplier));
}

export function scaleNutrients(nutrients: NutrientData, multiplier: number) {
  if (multiplier === 1) {
    return nutrients;
  }

  return Object.keys(nutrients)
    .map((key) => ({
      ...nutrients[key],
      key,
      quantity: nutrients[key].quantity * multiplier,
    }))
    .reduce((newNutrients: NutrientData, nc) => {
      const {key, ...nd} = nc;
      newNutrients[key] = nd;
      return newNutrients;
    }, {});
}

export function scaleRecipe(recipe: RecipeData, multiplier: number): RecipeData {
  if (multiplier === 1) {
    return recipe;
  }

  const nutrition = recipe.nutrition;

  return {
    ...recipe,
    ingredients: scaleIngredients(recipe.ingredients, multiplier),
    nutrition: {
      perCalories: scaleNutrients(nutrition.perCalories, multiplier),
      perDaily: scaleNutrients(nutrition.perDaily, multiplier),
      perWeight: scaleNutrients(nutrition.perWeight, multiplier),
      totalCalories: nutrition.totalCalories * multiplier,
      totalWeight: nutrition.totalWeight * multiplier,
    },
    servings: recipe.servings * multiplier,
  };
}
