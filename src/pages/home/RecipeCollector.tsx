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
import MealGroup from "./recipeCollector/MealGroup";
import { scaleRecipe } from "./recipeCollector/recipe/utils";

import "./RecipeCollector.css";

export interface RecipeCollectorState {
  error: string | null;
  isSaving: boolean;
  isLoading: boolean;
  draftPlan: api.DraftPlanData;
  savedMealPlan: string | null;
}

export default class RecipeCollector extends React.Component {
  public state: RecipeCollectorState = {
    draftPlan: {
      groups: [
        {
          items: [],
          label: "Day 1"
        }
      ]
    },
    error: null,
    isLoading: false,
    isSaving: false,
    savedMealPlan: null
  };

  public async componentDidMount() {
    if (!/^\/[\w\d_-]{7,14}$/g.test(location.pathname)) {
      return history.replaceState({}, "Meal Plan Generator", "/");
    }

    try {
      this.setState({ isLoading: true });
      const planId = location.pathname.substring(1);
      const mealPlan = await api.showMealPlan(planId);

      if (!mealPlan) {
        return history.replaceState({}, "Meal Plan Generator", "/");
      }

      const dupeRecipes = mealPlan.groups.flatMap(g => {
        return g.items.map(i => i.recipeUrl);
      });

      const uniqRecipes = await Promise.all(
        Array.from(new Set(dupeRecipes)).map(async url => {
          return api.analyzeRecipe(url);
        })
      );

      const recipeMap = uniqRecipes.reduce((a: any, b) => {
        a[b.url] = b;
        return a;
      }, {});

      const draftPlan: api.DraftPlanData = {
        groups: mealPlan.groups.map(g => ({
          items: g.items.map(i => recipeMap[i.recipeUrl]),
          label: g.label
        }))
      };

      this.setState({ draftPlan });
    } catch (err) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  public onHideNotification = () => this.setState({ error: null });

  public onCheckout = () => {
    const { groups } = this.state.draftPlan;
    const recipes: { [url: string]: api.RecipeData } = {};
    for (const g of groups) {
      for (const i of g.items) {
        const recipe = recipes[i.url];
        if (recipe) {
          const newServings = recipe.servings + i.servings;
          recipes[i.url] = scaleRecipe(recipe, newServings / recipe.servings);
        } else {
          recipes[i.url] = i;
        }
      }
    }

    whisk.queue.push(() => {
      whisk.shoppingList.addProductsToBasket({
        products: Object.values(recipes)
          .map(r => {
            return r.ingredients;
          })
          .reduce((a, b) => a.concat(b), [])
      });
    });
  };

  public onChange = (group: api.DraftGroupData, index: number) => {
    const { draftPlan } = this.state;
    const groups = draftPlan.groups;

    const front = groups.slice(0, index);
    const back = groups.slice(index + 1, groups.length);

    this.setState({
      draftPlan: {
        ...draftPlan,
        groups: front.concat(group).concat(back)
      }
    });
  };

  public onSave = async () => {
    try {
      this.setState({ error: null, isSaving: true });
      const draftPlan = await api.saveMealPlan(this.state.draftPlan);

      this.setState({
        isSaving: false,
        savedMealPlan: `${location.protocol}//${location.host}/${draftPlan.id}`
      });

      history.replaceState({}, "Meal Plan Generator", draftPlan.id.toString());
    } catch (err) {
      this.setState({ error: err.message, isSaving: false });
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

  public renderGroups() {
    const { groups } = this.state.draftPlan;
    if (!groups[0]) {
      return null;
    }

    return groups.map((group, index) => {
      const onPreAdd = () => this.setState({ error: null });
      const onChange = (g: api.DraftGroupData) => this.onChange(g, index);
      const onError = (r: Error) => this.setState({ error: r.message });

      return (
        <MealGroup
          key={index}
          data={group}
          onError={onError}
          onChange={onChange}
          onPreAdd={onPreAdd}
        />
      );
    });
  }

  public render() {
    const { isSaving, draftPlan } = this.state;
    const noRecipes = draftPlan.groups.length === 0;

    return (
      <Box className="recipe-collector">
        {this.renderLoading()}
        {this.renderNotification()}
        {this.renderGroups()}
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
