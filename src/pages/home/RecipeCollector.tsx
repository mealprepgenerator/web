import * as React from "react";

import {
  Box,
  Button,
  Column,
  Columns,
} from "bloomer";

import { apiUrl } from "../../config";
import AddRecipe from "./recipeCollector/AddRecipe";
import Recipe, { RecipeData } from "./recipeCollector/Recipe";
import { scaleRecipe } from "./recipeCollector/recipe/utils";

import "./RecipeCollector.css";

export interface MealPlanData {
  id: number;
  recipes: MealPlanRecipe[];
}

export interface MealPlanRecipe {
  servings: number;
  recipeUrl: string;
}

export interface RecipeCollectorState {
  error: string | null;
  recipes: RecipeData[];
  savedMealPlan: string | null;
}

export default class RecipeCollector extends React.Component {
  public state: RecipeCollectorState = {
    error: null,
    recipes: [],
    savedMealPlan: null,
  };

  public async componentDidMount() {
    if (!/^\/[\w\d_-]{7,14}$/g.test(location.pathname)) {
      return history.replaceState({}, "Meal Plan Generator", "/");
    }

    const planId = location.pathname.substring(1);
    const mealPlan = await showMealPlan(planId);

    if (!mealPlan) {
      return history.replaceState({}, "Meal Plan Generator", "/");
    }

    this.setState({
      recipes: await Promise.all(
        mealPlan.recipes.map(async (r: any) => {
          const fullRecipe = await analyzeRecipe(r.recipeUrl);
          return scaleRecipe(fullRecipe, r.servings / fullRecipe.servings);
        }),
      ),
    });
  }

  public onCheckout = () => {
    whisk.queue.push(() => {
      whisk.shoppingList.addProductsToBasket({
        products: this.state.recipes.map((r) => {
          return r.ingredients;
        }).reduce((a, b) => a.concat(b), []),
      });
    });
  }

  public onChange = (recipe: RecipeData) => {
    const {recipes} = this.state;

    const index = recipes.findIndex((r) => r.name === recipe.name);
    const front = recipes.slice(0, index);
    const back = recipes.slice(index + 1, recipes.length);

    this.setState({
      recipes: front.concat(recipe).concat(back),
    });
  }

  public onRemove = (recipe: RecipeData) => {
    const {recipes} = this.state;

    const index = recipes.findIndex((r) => r.name === recipe.name);
    const front = recipes.slice(0, index);
    const back = recipes.slice(index + 1, recipes.length);

    this.setState({
      recipes: front.concat(back),
    });
  }

  public onSave = async () => {
    const mealPlan = await saveMealPlan(this.state.recipes);

    this.setState({
      savedMealPlan: `${apiUrl}/${mealPlan.id}`,
    });

    history.replaceState({}, "Meal Plan Generator", mealPlan.id.toString());
  }

  public onAdd = async (recipeUrl: string) => {
    if (!recipeUrl) {
      alert("Please enter a valid recipe URL");
      return;
    }

    try {
      this.setState({error: null});
      const recipe = await analyzeRecipe(recipeUrl);

      // Check if the recipe has already been added
      if (this.state.recipes.map((r) => r.name).includes(recipe.name)) {
        return;
      }

      this.setState({recipes: this.state.recipes.concat(recipe)});
    } catch (err) {
      this.setState({error: err.message});
    }
  }

  public renderNutrition() {
    const {recipes} = this.state;
    if (!recipes[0]) {
      return null;
    }

    const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
    const totalFat = recipes.map((r) => r.nutrition.perWeight.FAT.quantity);
    const totalCarbs = recipes.map((r) => r.nutrition.perWeight.CHOCDF.quantity);
    const totalProtein = recipes.map((r) => r.nutrition.perWeight.PROCNT.quantity);

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
  }

  public renderRecipes() {
    const {recipes} = this.state;
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

  public render() {
    const {error} = this.state;

    return (
      <Box className="recipe-collector">
        {error && <p>{error}</p>}
        {this.renderNutrition()}
        {this.renderRecipes()}
        <AddRecipe onAdd={this.onAdd} />
        <Columns isMobile={true}>
          <Column isSize="narrow">
            <Button onClick={this.onSave}>Save</Button>
          </Column>
          <Column isSize="narrow">
            <Button onClick={this.onCheckout}>Checkout</Button>
          </Column>
        </Columns>
        {this.state.savedMealPlan && <p>Meal Plan URL: {this.state.savedMealPlan}</p>}
      </Box>
    );
  }
}

export async function analyzeRecipe(url: string): Promise<RecipeData> {
  const recipeUrl = encodeURIComponent(url);
  const response = await fetch(`${apiUrl}/analyze?recipeUrl=${recipeUrl}`);

  if (!response.ok) {
    throw new Error("Could not analyze the given recipe");
  }

  return response.json();
}

export async function saveMealPlan(recipes: RecipeData[]): Promise<MealPlanData> {
  const response = await fetch(`${apiUrl}/plans`, {
    body: JSON.stringify({
      recipes: recipes.map((r) => ({
        recipeUrl: r.url,
        servings: r.servings,
      })),
    }),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Could not save the given meal plan");
  }

  return response.json();
}

export async function showMealPlan(planId: string): Promise<MealPlanData | null> {
  const response = await fetch(`${apiUrl}/plans/${planId}`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}
