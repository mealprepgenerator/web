import * as React from "react";

import { Section, Title } from "bloomer";

import Instructions from "./home/Instructions";
import RecipeCollector from "./home/RecipeCollector";

const Home: React.SFC = () => (
  <>
    <Section hasTextAlign="centered">
      <Title hasTextColor="grey-dark">
        Meal Prep Generator
      </Title>
    </Section>
    <Section>
      <RecipeCollector />
    </Section>
    <Section>
      <Instructions />
    </Section>
  </>
);

export default Home;
