import * as React from "react";

import {
  Button,
  Column,
  Columns,
  Container,
  Content,
  Delete,
  Notification
} from "bloomer";

import * as api from "../../../services/api";
import MealGroup from "./recipeCollector/MealGroup";
import { RecipeCollectorState } from "./RecipeCollectorContainer";

import "./RecipeCollector.css";

export interface RecipeCollectorProps {
  data: RecipeCollectorState;
  onSave?(): void;
  onError?(error: Error): void;
  onChange?(group: api.DraftGroupData, index: number): void;
  onAddGroup?(): void;
  onCheckout?(): void;
  onHideNotification?(): void;
}

export default class RecipeCollector extends React.Component<
  RecipeCollectorProps
> {
  public getAllRecipes = () =>
    this.props.data.draftPlan.groups
      .map(g => g.items.map(i => i.url))
      .reduce((a, b) => a.concat(b), []);

  public renderSavedMealPlan() {
    const { savedMealPlan } = this.props.data;
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
    const { error } = this.props.data;
    if (!error) {
      return null;
    }

    return (
      <Notification isColor="danger">
        <Delete onClick={this.props.onHideNotification} />
        {error}
      </Notification>
    );
  }

  public renderActions() {
    const { isSaving } = this.props.data;
    const disableActions = this.getAllRecipes().length === 0;

    return (
      <Columns isMobile={true}>
        <Column isSize="narrow">
          <Button
            onClick={this.props.onSave}
            disabled={disableActions}
            isLoading={isSaving}
          >
            Save
          </Button>
        </Column>
        <Column isSize="narrow">
          <Button onClick={this.props.onCheckout} disabled={disableActions}>
            Checkout
          </Button>
        </Column>
        <Column isSize="narrow">
          <Button onClick={this.props.onAddGroup} disabled={disableActions}>
            New Group
          </Button>
        </Column>
      </Columns>
    );
  }

  public renderLoading() {
    const { isLoading } = this.props.data;
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
    const { groups } = this.props.data.draftPlan;
    if (!groups[0]) {
      return null;
    }

    return groups.map((group, index) => {
      const onChange = (g: api.DraftGroupData) =>
        this.props.onChange && this.props.onChange(g, index);

      return (
        <MealGroup
          key={index}
          data={group}
          onError={this.props.onError}
          onChange={onChange}
          onPreAdd={this.props.onHideNotification}
          showLabel={groups.length > 1}
        />
      );
    });
  }

  public render() {
    return (
      <Container className="recipe-collector">
        {this.renderLoading()}
        {this.renderNotification()}
        {this.renderGroups()}
        {this.renderActions()}
        {this.renderSavedMealPlan()}
      </Container>
    );
  }
}
