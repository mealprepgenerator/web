import * as React from "react";

import { Button, Column, Columns, Input } from "bloomer";

export interface AddRecipeProps {
  onAdd: (recipeUrl: string) => void;
}

export interface AddRecipeState {
  recipeUrl: string;
}

class AddRecipe extends React.Component<AddRecipeProps, AddRecipeState> {
  public state: AddRecipeState = {
    recipeUrl: "",
  };

  public onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({recipeUrl: e.target.value})

  public onClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    this.props.onAdd(this.state.recipeUrl)

  public render() {
    return (
      <Columns isMobile={true}>
        <Column isSize="2/3">
          <Input
            type="text"
            onChange={this.onChange}
            placeholder="Enter a valid recipe URL"
          />
        </Column>
        <Column>
          <Button onClick={this.onClick}>
            Add Recipe
          </Button>
        </Column>
      </Columns>
    );
  }
}

export default AddRecipe;
