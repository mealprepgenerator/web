import * as React from "react";

import { Button, Column, Columns, Input } from "bloomer";

export interface AddRecipeProps {
  onAdd(recipeUrl: string): Promise<void>;
}

export interface AddRecipeState {
  recipeUrl: string;
  isLoading: boolean;
}

class AddRecipe extends React.Component<AddRecipeProps, AddRecipeState> {
  public state: AddRecipeState = {
    isLoading: false,
    recipeUrl: ""
  };

  public onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ recipeUrl: e.target.value });

  public onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ isLoading: true });
    await this.props.onAdd(this.state.recipeUrl);
    this.setState({ isLoading: false, recipeUrl: "" });
  };

  public render() {
    return (
      <Columns isMobile={true} isVCentered={true}>
        <Column isSize={{ mobile: "1/2", desktop: "2/3" }}>
          <Input
            type="text"
            value={this.state.recipeUrl}
            onChange={this.onChange}
            placeholder="Enter a valid recipe URL"
          />
        </Column>
        <Column>
          <Button onClick={this.onClick} isLoading={this.state.isLoading}>
            Add Recipe
          </Button>
        </Column>
      </Columns>
    );
  }
}

export default AddRecipe;
