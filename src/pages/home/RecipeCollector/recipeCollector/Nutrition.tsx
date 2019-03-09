import * as React from "react";

import { Button, Column, Columns, Icon } from "bloomer";

import * as api from "../../../../services/api";

import FullStatChart from "./nutrition/FullStatChart";
import RatioChart from "./nutrition/RatioChart";
import RatioDot from "./nutrition/RatioDot";

export interface NutritionProps {
  recipes: api.RecipeData[];
}

const Nutrition: React.SFC<NutritionProps> = ({ recipes }) => {
  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  const totalFat = recipes.map(r => r.nutrition.perWeight.FAT.quantity);
  const totalCarbs = recipes.map(r => r.nutrition.perWeight.CHOCDF.quantity);
  const totalProtein = recipes.map(r => r.nutrition.perWeight.PROCNT.quantity);

  const chartValues = [
    { value: sum(totalFat), color: "#2b7489" },
    { value: sum(totalCarbs), color: "#e34c26" },
    { value: sum(totalProtein), color: "#563d7c" }
  ];

  return (
    <>
      <FullStatChart data={recipes} />
      <Columns isVCentered={true}>
        <Column isSize="narrow" hasTextAlign="right">
          <Button isOutlined={true}>
            <Icon isSize="medium" className="fa fa-chart-bar" />
          </Button>
        </Column>
        <Column>
          <p>
            <RatioDot color={chartValues[0].color} />
            <strong>Fat:</strong> {chartValues[0].value.toFixed(2)}g
          </p>
        </Column>
        <Column>
          <p>
            <RatioDot color={chartValues[1].color} />
            <strong>Carbs:</strong> {chartValues[1].value.toFixed(2)}g
          </p>
        </Column>
        <Column>
          <p>
            <RatioDot color={chartValues[2].color} />
            <strong>Protein:</strong> {chartValues[2].value.toFixed(2)}g
          </p>
        </Column>
      </Columns>
      <RatioChart data={chartValues} />
    </>
  );
};

export default Nutrition;
