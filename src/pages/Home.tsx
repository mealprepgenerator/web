import * as React from "react";

import { Section } from "bloomer";

import Footer from "../lib/Footer";
import Header from "../lib/Header";
import Instructions from "./home/Instructions";
import RecipeCollector from "./home/RecipeCollector";

const Home: React.SFC = () => (
  <>
    <Header />
    <Section>
      <RecipeCollector />
    </Section>
    <Section>
      <Instructions />
    </Section>
    <Footer />
  </>
);

export default Home;
