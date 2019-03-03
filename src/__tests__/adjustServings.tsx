import * as React from "react";

import { StateMock } from "@react-mock/state";
import * as rtl from "react-testing-library";

import recipeData from "../__fixtures__/recipeData";
import RecipeCollector, {
  RecipeCollectorState
} from "../pages/home/RecipeCollector";

afterEach(() => {
  jest.clearAllMocks();
});

function renderComponent(state: Partial<RecipeCollectorState>) {
  return rtl.render(
    <StateMock state={state}>
      <RecipeCollector />
    </StateMock>
  );
}

test("Changing the serving up recalculates nutrition correctly", () => {
  const { getByDisplayValue, getByText } = renderComponent({
    recipes: [recipeData]
  });

  const input = getByDisplayValue("2");
  rtl.fireEvent.change(input, { target: { value: "3" } });

  expect(getByText(/Fat:+/i)).toHaveTextContent(/1.50g/);
  expect(getByText(/Carbs:+/i)).toHaveTextContent(/1.50g/);
  expect(getByText(/Protein:+/i)).toHaveTextContent(/1.50g/);
});

test("Changing the serving down recalculates nutrition correctly", () => {
  const { getByDisplayValue, getByText } = renderComponent({
    recipes: [recipeData]
  });

  const input = getByDisplayValue("2");
  rtl.fireEvent.change(input, { target: { value: "1" } });

  expect(getByText(/Fat:+/i)).toHaveTextContent(/0.50g/);
  expect(getByText(/Carbs:+/i)).toHaveTextContent(/0.50g/);
  expect(getByText(/Protein:+/i)).toHaveTextContent(/0.50g/);
});
