import * as React from "react";

import { Column, Columns } from "bloomer";

import * as api from "../../../../services/api";

export interface NutritionProps {
  recipes: api.RecipeData[];
}

const Nutrition: React.SFC<NutritionProps> = ({ recipes }) => {
  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  const totalFat = recipes.map(r => r.nutrition.perWeight.FAT.quantity);
  const totalCarbs = recipes.map(r => r.nutrition.perWeight.CHOCDF.quantity);
  const totalProtein = recipes.map(r => r.nutrition.perWeight.PROCNT.quantity);

  return (
    <Columns isMobile={true}>
      <Column>
        <p>Fat: {sum(totalFat).toFixed(2)}g</p>
      </Column>
      <Column>
        <p>Carbs: {sum(totalCarbs).toFixed(2)}g</p>
      </Column>
      <Column>
        <p>Protein: {sum(totalProtein).toFixed(2)}g</p>
      </Column>
    </Columns>
  );
};

export default Nutrition;
