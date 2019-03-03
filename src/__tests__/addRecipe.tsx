import * as React from "react";

import * as rtl from "react-testing-library";

jest.mock("../services/api");

const alertSpy = jest.spyOn(window, "alert");

beforeEach(() => {
  alertSpy.mockImplementation(() => false);
});

afterEach(() => {
  jest.clearAllMocks();
});

test("Adding a recipe without a URL shows a warning", async () => {
  const App = require("../App").default;

  const {getByText} = rtl.render(<App />);

  rtl.fireEvent.click(getByText("Add Recipe"));
  expect(alertSpy).toHaveBeenCalled();
});

test("Adding a recipe with a valid URL gets analyzed", async () => {
  const api = require("../services/api");
  const App = require("../App").default;

  const {getByText, getByPlaceholderText} = rtl.render(<App />);

  const input = getByPlaceholderText("Enter a valid recipe URL");
  rtl.fireEvent.change(input, { target: { value: "some-valid-url" } });
  rtl.fireEvent.click(getByText("Add Recipe"));

  await rtl.waitForElement(() => getByText("some-name"));

  expect(api.analyzeRecipe).toHaveBeenCalledWith("some-valid-url");
});

test("Adding a recipe with an invalid URL gets an error", async () => {
  const api = require("../services/api");
  const App = require("../App").default;

  api.analyzeRecipe.mockRejectedValueOnce(new Error("some error"));

  const {getByText, getByPlaceholderText} = rtl.render(<App />);

  const input = getByPlaceholderText("Enter a valid recipe URL");
  rtl.fireEvent.change(input, { target: { value: "some-invalid-url" } });
  rtl.fireEvent.click(getByText("Add Recipe"));

  await rtl.waitForElement(() => getByText("some error"));
});
