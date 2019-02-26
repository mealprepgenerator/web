import * as React from "react";

import RecipeCollector from "./home/RecipeCollector";

import "./Home.css";

const Home: React.SFC = () => (
  <div className="home">
    <RecipeCollector />
  </div>
);

export default Home;
