import * as React from "react";

import { Column, Columns, Section, Subtitle, Title } from "bloomer";

import "./Instructions.css";

const Instructions: React.SFC = () => (
  <>
    <Subtitle hasTextAlign="centered">How it works</Subtitle>
    <Columns isCentered={true} className="instructions">
      <Column
        hasTextAlign="centered"
        isSize={{mobile: 10}}
        className="instruction-icon"
      >
        <Title isSize={5} hasTextColor="dark">1. Add</Title>
        <img width="50%" src="/images/recipe-book.png" alt="Recipe Book"/>
        <Section>
          <p>Add your favourite recipes via URL to the overall cart</p>
        </Section>
      </Column>
      <Column
        hasTextAlign="centered"
        isSize={{mobile: 10}}
        className="instruction-icon"
      >
        <Title isSize={5} hasTextColor="dark">2. Adjust</Title>
        <img width="50%" src="/images/calculator.png" alt="Calculator"/>
        <Section>
          <p>Adjust your servings to match your desired macros</p>
        </Section>
      </Column>
      <Column
        hasTextAlign="centered"
        isSize={{mobile: 10}}
        className="instruction-icon"
      >
        <Title isSize={5} hasTextColor="dark">3. Checkout</Title>
        <img width="50%" src="/images/cart.png" alt="Shopping Cart"/>
        <Section>
          <p>Checkout all the combined ingredients to your favourite grocery store</p>
        </Section>
      </Column>
    </Columns>
  </>
);

export default Instructions;
