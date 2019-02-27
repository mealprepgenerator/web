import * as React from "react";

import { Section } from "bloomer";

import RecipeCollector from "./home/RecipeCollector";

const Home: React.SFC = () => (
  <Section>
    <RecipeCollector />
  </Section>
);

export default Home;
