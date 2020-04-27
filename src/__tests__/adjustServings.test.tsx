import * as React from "react";

import { StateMock } from "@react-mock/state";
import * as rtl from "@testing-library/react";

import draftPlanData from "../__fixtures__/draftPlanData";
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
    draftPlan: draftPlanData
  });

  const input = getByDisplayValue("2");
  rtl.fireEvent.change(input, { target: { value: "3" } });

  expect(getByText(/Fat:+/i).parentElement).toHaveTextContent(/1.50g/);
  expect(getByText(/Carbs:+/i).parentElement).toHaveTextContent(/1.50g/);
  expect(getByText(/Protein:+/i).parentElement).toHaveTextContent(/1.50g/);
});

test("Changing the serving down recalculates nutrition correctly", () => {
  const { getByDisplayValue, getByText } = renderComponent({
    draftPlan: draftPlanData
  });

  const input = getByDisplayValue("2");
  rtl.fireEvent.change(input, { target: { value: "1" } });

  expect(getByText(/Fat:+/i).parentElement).toHaveTextContent(/0.50g/);
  expect(getByText(/Carbs:+/i).parentElement).toHaveTextContent(/0.50g/);
  expect(getByText(/Protein:+/i).parentElement).toHaveTextContent(/0.50g/);
});
