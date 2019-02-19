import * as React from "react";

import "./AddRecipe.css";

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
      <div className="add-recipe">
        <input
          type="text"
          onChange={this.onChange}
          placeholder="Enter a valid recipe URL"
        />

        <button type="button" onClick={this.onClick}>
          Add Recipe
        </button>
      </div>
    );
  }
}

export default AddRecipe;
