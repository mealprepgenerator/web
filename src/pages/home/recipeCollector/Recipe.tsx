import * as React from "react";

import "./Recipe.css";
import { scaleRecipe } from "./recipe/utils";

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

export interface RecipeActions {
  onChange: (servings: string) => void;
}

export interface RecipeProps {
  data: RecipeData;
  onChange: (recipe: RecipeData) => void;
  onRemove: (recipe: RecipeData) => void;
}

export default class Recipe extends React.Component<RecipeProps> {
  public onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { servings } = this.props.data;
    const newServings = parseInt(e.target.value, 10) || 1;
    const multiplier = newServings / servings;

    const newRecipe = scaleRecipe(this.props.data, multiplier);
    this.props.onChange(newRecipe);
  }

  public onRemove = (e: React.MouseEvent<HTMLButtonElement>) =>
    this.props.onRemove(this.props.data)

  public render() {
    const {name, servings} = this.props.data;

    return (
      <div className="recipe">
        <input
          type="number"
          value={String(servings)}
          onChange={this.onChange}
        />
        <p>{name}</p>
        <button type="button" onClick={this.onRemove}>
          Remove Recipe
        </button>
      </div>
    );
  }
}
