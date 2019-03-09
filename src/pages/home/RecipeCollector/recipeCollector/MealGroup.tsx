import * as React from "react";

import { Box, Button, Column, Columns, Content, Icon, Subtitle } from "bloomer";

import * as api from "../../../../services/api";
import Nutrition from "../recipeCollector/Nutrition";
import Recipe from "../recipeCollector/Recipe";
import AddRecipe from "./AddRecipe";
import Label from "./mealGroup/Label";

export interface MealGroupState {
  isLoading: boolean;
  showChart: boolean;
}

export interface MealGroupProps {
  data: api.DraftGroupData;
  onClose?: () => void;
  onError?: (error: Error) => void;
  onChange?: (group: api.DraftGroupData) => void;
  onPreAdd?: () => void;
  showLabel?: boolean;
  showClose?: boolean;
}

export default class MealGroup extends React.Component<
  MealGroupProps,
  MealGroupState
> {
  public static defaultProps: Partial<MealGroupProps> = {
    showClose: false,
    showLabel: false
  };

  public state: MealGroupState = {
    isLoading: false,
    showChart: false
  };

  public onToggleChart = () =>
    this.setState({ showChart: !this.state.showChart });

  public onChange = (recipe: api.RecipeData) => {
    const { items } = this.props.data;

    const index = items.findIndex(r => r.name === recipe.name);
    const front = items.slice(0, index);
    const back = items.slice(index + 1, items.length);

    if (this.props.onChange) {
      this.props.onChange({
        ...this.props.data,
        items: front.concat(recipe).concat(back)
      });
    }
  };

  public onRemove = (recipe: api.RecipeData) => {
    const { items } = this.props.data;

    const index = items.findIndex(r => r.name === recipe.name);
    const front = items.slice(0, index);
    const back = items.slice(index + 1, items.length);

    if (this.props.onChange) {
      this.props.onChange({
        ...this.props.data,
        items: front.concat(back)
      });
    }
  };

  public onEdit = (label: string) => {
    if (this.props.onChange) {
      this.props.onChange({
        ...this.props.data,
        label
      });
    }
  };

  public onAdd = async (recipeUrl: string) => {
    if (!recipeUrl) {
      alert("Please enter a valid recipe URL");
      return;
    }

    try {
      if (this.props.onPreAdd) {
        this.props.onPreAdd();
      }

      const recipe = await api.analyzeRecipe(recipeUrl);

      // Check if the recipe has already been added
      if (this.props.data.items.map(r => r.name).includes(recipe.name)) {
        return;
      }

      if (this.props.onChange) {
        this.props.onChange({
          ...this.props.data,
          items: this.props.data.items.concat(recipe)
        });
      }
    } catch (err) {
      if (this.props.onError) {
        this.props.onError(err);
      }
    }
  };

  public renderNutrition() {
    const { items } = this.props.data;
    if (!items[0]) {
      return null;
    }

    return (
      <Nutrition
        recipes={items}
        showChart={this.state.showChart}
        onToggleChart={this.onToggleChart}
      />
    );
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

  public renderHeader() {
    const { showClose, showLabel } = this.props;
    if (!showClose && !showLabel) {
      return null;
    }

    return (
      <Columns isMobile={true} isVCentered={true}>
        <Column isSize="narrow">{this.renderLabel()}</Column>
        <Column hasTextAlign="right">{this.renderClose()}</Column>
      </Columns>
    );
  }

  public renderLabel() {
    const { showLabel, data } = this.props;
    if (!showLabel) {
      return null;
    }

    return <Label onEdit={this.onEdit}>{data.label}</Label>;
  }

  public renderClose() {
    const { showClose, onClose } = this.props;
    if (!showClose) {
      return null;
    }

    return (
      <Button isColor="danger" isOutlined={true} onClick={onClose}>
        <Icon isSize="medium" className="fa fa-times" />
      </Button>
    );
  }

  public render() {
    return (
      <Box>
        {this.renderHeader()}
        {this.renderNutrition()}
        {this.renderRecipes()}
        <AddRecipe onAdd={this.onAdd} />
      </Box>
    );
  }
}
