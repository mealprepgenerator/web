import * as React from "react";

import * as api from "../../../services/api";
import RecipeCollector from "./RecipeCollector";
import { scaleRecipe } from "./recipeCollector/recipe/utils";

export interface RecipeCollectorState {
  error: string | null;
  isSaving: boolean;
  isLoading: boolean;
  draftPlan: api.DraftPlanData;
  savedMealPlan: string | null;
}

class RecipeCollectorContainer extends React.Component<
  {},
  RecipeCollectorState
> {
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

      const dupeRecipes = mealPlan.groups
        .map(g => g.items.map(i => i.recipeUrl))
        .reduce((a, b) => a.concat(b), []);

      const uniqRecipes = await Promise.all(
        Array.from(new Set(dupeRecipes)).map(async url => {
          return api.analyzeRecipe(url);
        })
      );

      const recipeMap: { [url: string]: api.RecipeData } = uniqRecipes.reduce(
        (a: any, b) => {
          a[b.url] = b;
          return a;
        },
        {}
      );

      const draftPlan: api.DraftPlanData = {
        groups: mealPlan.groups.map(g => ({
          items: g.items.map(i => {
            const fullRecipe = recipeMap[i.recipeUrl];
            return scaleRecipe(fullRecipe, i.servings / fullRecipe.servings);
          }),
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

  public onAddGroup = () => {
    const { groups } = this.state.draftPlan;

    this.setState({
      draftPlan: {
        ...this.state.draftPlan,
        groups: groups.concat({
          items: [],
          label: `Day ${groups.length + 1}`
        })
      }
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

  public onError = (error: Error) => this.setState({ error: error.message });

  public onClose = (index: number) => {
    if (!confirm("Are you sure you want to remove this group?")) {
      return;
    }

    const groups = this.state.draftPlan.groups;

    const front = groups.slice(0, index);
    const back = groups.slice(index + 1, groups.length);

    this.setState({
      draftPlan: {
        ...this.state.draftPlan,
        groups: front.concat(back)
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

  public render() {
    return (
      <RecipeCollector
        data={this.state}
        onSave={this.onSave}
        onError={this.onError}
        onClose={this.onClose}
        onChange={this.onChange}
        onAddGroup={this.onAddGroup}
        onCheckout={this.onCheckout}
        onHideNotification={this.onHideNotification}
      />
    );
  }
}

export default RecipeCollectorContainer;
