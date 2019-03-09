import * as React from "react";

import "./RatioChart.css";

export interface RatioChartValue {
  value: number;
  color: string;
}

export interface RatioChartProps {
  data: RatioChartValue[];
}

const RatioChart: React.SFC<RatioChartProps> = ({ data }) => {
  const total = data.map(v => v.value).reduce((a, b) => a + b, 0);

  return (
    <div className="ratio-chart">
      {data.map(({ value, color }, index) => (
        <div
          className="ratio-chart-value"
          key={index}
          style={{
            backgroundColor: color,
            width: `${((value / total) * 100).toFixed(1)}%`
          }}
        />
      ))}
    </div>
  );
};

export default RatioChart;
