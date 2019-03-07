import * as React from "react";

import { Content } from "bloomer";
import { Container } from "bloomer/lib/layout/Container";

import * as api from "../../../services/api";
import Nutrition from "../recipeCollector/Nutrition";
import Recipe from "../recipeCollector/Recipe";
import AddRecipe from "./AddRecipe";

export interface MealGroupState {
  isLoading: boolean;
}

export interface MealGroupProps {
  key?: number;
  data: api.DraftGroupData;
}

export default class MealGroup extends React.Component<MealGroupProps> {
  public state: MealGroupState = {
    isLoading: false
  };

  public onChange = (recipe: api.RecipeData) => {
    const { items } = this.props.data;

    const index = items.findIndex(r => r.name === recipe.name);
    const front = items.slice(0, index);
    const back = items.slice(index + 1, items.length);

    this.setState({
      recipes: front.concat(recipe).concat(back)
    });
  };

  public onRemove = (recipe: api.RecipeData) => {
    const { items } = this.props.data;

    const index = items.findIndex(r => r.name === recipe.name);
    const front = items.slice(0, index);
    const back = items.slice(index + 1, items.length);

    this.setState({
      recipes: front.concat(back)
    });
  };

  public onAdd = async (recipeUrl: string) => {
    if (!recipeUrl) {
      alert("Please enter a valid recipe URL");
      return;
    }

    try {
      this.setState({ error: null });
      const recipe = await api.analyzeRecipe(recipeUrl);

      // Check if the recipe has already been added
      if (this.props.data.items.map(r => r.name).includes(recipe.name)) {
        return;
      }

      this.setState({ recipes: this.props.data.items.concat(recipe) });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  public renderNutrition() {
    const { items } = this.props.data;
    if (!items[0]) {
      return null;
    }

    return <Nutrition recipes={items} />;
  }

  public renderRecipes() {
    const { items } = this.props.data;
    if (!items[0]) {
      return null;
    }

    return items.map((r, index) => (
      <Recipe
        key={index}
        data={r}
        onChange={this.onChange}
        onRemove={this.onRemove}
      />
    ));
  }

  public renderLoading() {
    const { isLoading } = this.state;
    if (!isLoading) {
      return null;
    }

    return (
      <Content>
        <p>Loading items...</p>
      </Content>
    );
  }

  public render() {
    return (
      <>
        {this.renderNutrition()}
        {this.renderRecipes()}
        <AddRecipe onAdd={this.onAdd} />
      </>
    );
  }
}
