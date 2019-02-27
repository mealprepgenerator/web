import * as React from "react";

import { Button, Column, Columns, Input } from "bloomer";

export interface AddRecipeProps {
  onAdd(recipeUrl: string): Promise<void>;
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

  public onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await this.props.onAdd(this.state.recipeUrl);
    this.setState({recipeUrl: ""});
  }

  public render() {
    return (
      <Columns isMobile={true} isVCentered={true}>
        <Column isSize={{ mobile: "1/2", desktop: "2/3"}}>
          <Input
            type="text"
            value={this.state.recipeUrl}
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
