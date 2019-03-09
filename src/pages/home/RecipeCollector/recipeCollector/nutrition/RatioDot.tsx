import * as React from "react";

export interface RatioDotProps {
  color: string;
}

const RatioDot: React.SFC<RatioDotProps> = ({ color }) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: "50%",
      display: "inline-block",
      height: "0.625em",
      margin: "0 0.25em",
      width: "0.625em"
    }}
  />
);

export default RatioDot;
