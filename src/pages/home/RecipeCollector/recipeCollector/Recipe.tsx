import * as React from "react";

import { Column, Columns, Delete, Input } from "bloomer";

import * as api from "../../../../services/api";
import { scaleRecipe } from "./recipe/utils";

export interface RecipeActions {
  onChange: (servings: string) => void;
}

export interface RecipeProps {
  data: api.RecipeData;
  onChange: (recipe: api.RecipeData) => void;
  onRemove: (recipe: api.RecipeData) => void;
}

export default class Recipe extends React.Component<RecipeProps> {
  public onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { servings } = this.props.data;
    const newServings = parseInt(e.target.value, 10) || 1;
    const multiplier = newServings / servings;

    const newRecipe = scaleRecipe(this.props.data, multiplier);
    this.props.onChange(newRecipe);
  };

  public onRemove = (e: React.MouseEvent<HTMLButtonElement>) =>
    this.props.onRemove(this.props.data);

  public render() {
    const { name, url, servings } = this.props.data;

    return (
      <Columns isVCentered={true} isCentered={true} isMobile={true}>
        <Column isSize={2}>
          <Input
            type="number"
            value={String(servings)}
            onChange={this.onChange}
          />
        </Column>
        <Column>
          <a href={url} target="_blank">
            {name}
          </a>
        </Column>
        <Column isSize="narrow">
          <Delete onClick={this.onRemove}>Remove Recipe</Delete>
        </Column>
      </Columns>
    );
  }
}
