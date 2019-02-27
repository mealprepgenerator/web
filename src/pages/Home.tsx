import * as React from "react";

import { Container } from "bloomer";

import RecipeCollector from "./home/RecipeCollector";

import "./Home.css";

const Home: React.SFC = () => (
  <Container className="home">
    <RecipeCollector />
  </Container>
);

export default Home;
