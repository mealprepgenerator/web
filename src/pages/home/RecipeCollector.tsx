import * as React from "react";

import {
  Box,
  Button,
  Column,
  Columns,
  Content,
  Delete,
  Notification
} from "bloomer";

import * as api from "../../services/api";
import AddRecipe from "./recipeCollector/AddRecipe";
import Nutrition from "./recipeCollector/Nutrition";
import Recipe from "./recipeCollector/Recipe";
import { scaleRecipe } from "./recipeCollector/recipe/utils";

import "./RecipeCollector.css";

export interface RecipeCollectorState {
  error: string | null;
  isLoading: boolean;
  isSaving: boolean;
  recipes: api.RecipeData[];
  savedMealPlan: string | null;
}

export default class RecipeCollector extends React.Component {
  public state: RecipeCollectorState = {
    error: null,
    isLoading: false,
    isSaving: false,
    recipes: [],
    savedMealPlan: null
  };

  public async componentDidMount() {
    if (!/^\/[\w\d_-]{7,14}$/g.test(location.pathname)) {
      return history.replaceState({}, "Meal Plan Generator", "/");
    }

    const planId = location.pathname.substring(1);
    const mealPlan = await api.showMealPlan(planId);

    if (!mealPlan) {
      return history.replaceState({}, "Meal Plan Generator", "/");
    }

    try {
      this.setState({ isLoading: true });
      const recipes = await Promise.all(
        mealPlan.recipes.map(async (r: any) => {
          const fullRecipe = await api.analyzeRecipe(r.recipeUrl);
          return scaleRecipe(fullRecipe, r.servings / fullRecipe.servings);
        })
      );

      this.setState({ recipes });
    } catch (err) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  public onHideNotification = () => this.setState({ error: null });

  public onCheckout = () => {
    whisk.queue.push(() => {
      whisk.shoppingList.addProductsToBasket({
        products: this.state.recipes
          .map(r => {
            return r.ingredients;
          })
          .reduce((a, b) => a.concat(b), [])
      });
    });
  };

  public onChange = (recipe: api.RecipeData) => {
    const { recipes } = this.state;

    const index = recipes.findIndex(r => r.name === recipe.name);
    const front = recipes.slice(0, index);
    const back = recipes.slice(index + 1, recipes.length);

    this.setState({
      recipes: front.concat(recipe).concat(back)
    });
  };

  public onRemove = (recipe: api.RecipeData) => {
    const { recipes } = this.state;

    const index = recipes.findIndex(r => r.name === recipe.name);
    const front = recipes.slice(0, index);
    const back = recipes.slice(index + 1, recipes.length);

    this.setState({
      recipes: front.concat(back)
    });
  };

  public onSave = async () => {
    try {
      this.setState({ error: null, isSaving: true });
      const mealPlan = await api.saveMealPlan(this.state.recipes);

      this.setState({
        isSaving: false,
        savedMealPlan: `${location.protocol}//${location.host}/${mealPlan.id}`
      });

      history.replaceState({}, "Meal Plan Generator", mealPlan.id.toString());
    } catch (err) {
      this.setState({ error: err.message, isSaving: false });
    }
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
      if (this.state.recipes.map(r => r.name).includes(recipe.name)) {
        return;
      }

      this.setState({ recipes: this.state.recipes.concat(recipe) });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  public renderSavedMealPlan() {
    const { savedMealPlan } = this.state;
    if (!savedMealPlan) {
      return null;
    }

    return (
      <Content>
        Meal Plan URL: <a href={savedMealPlan}>{savedMealPlan}</a>
      </Content>
    );
  }

  public renderNotification() {
    const { error } = this.state;
    if (!error) {
      return null;
    }

    return (
      <Notification isColor="danger">
        <Delete onClick={this.onHideNotification} />
        {error}
      </Notification>
    );
  }

  public renderNutrition() {
    const { recipes } = this.state;
    if (!recipes[0]) {
      return null;
    }

    return <Nutrition recipes={recipes} />;
  }

  public renderRecipes() {
    const { recipes } = this.state;
    if (!recipes[0]) {
      return null;
    }

    return recipes.map((r, index) => (
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
        <p>Loading recipes...</p>
      </Content>
    );
  }

  public render() {
    const { isSaving, recipes } = this.state;
    const noRecipes = recipes.length === 0;

    return (
      <Box className="recipe-collector">
        {this.renderLoading()}
        {this.renderNotification()}
        {this.renderNutrition()}
        {this.renderRecipes()}
        <AddRecipe onAdd={this.onAdd} />
        <Columns isMobile={true}>
          <Column isSize="narrow">
            <Button
              onClick={this.onSave}
              disabled={noRecipes}
              isLoading={isSaving}
            >
              Save
            </Button>
          </Column>
          <Column isSize="narrow">
            <Button onClick={this.onCheckout} disabled={noRecipes}>
              Checkout
            </Button>
          </Column>
        </Columns>
        {this.renderSavedMealPlan()}
      </Box>
    );
  }
}
