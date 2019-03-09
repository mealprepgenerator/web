import * as React from "react";

import { Chart, ChartData, ChartDataSets } from "chart.js";

import { RecipeData } from "../../../../../services/api";

export interface FullStatChartProps {
  data: RecipeData[];
}

class FullStatChart extends React.Component<FullStatChartProps> {
  public node?: HTMLCanvasElement | null;
  public chart?: Chart;

  public componentDidMount() {
    if (!this.node) {
      return;
    }

    this.chart = new Chart(this.node, {
      data: createBarChartData(this.props.data),
      options: {
        responsive: true,
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }]
        },
        tooltips: {
          intersect: false,
          mode: "index"
        }
      },
      type: "bar"
    });
  }

  public shouldComponentUpdate(nextProps: FullStatChartProps) {
    if (this.props.data.length !== nextProps.data.length) {
      return true;
    }

    const diffs = nextProps.data.filter(recipe => {
      const orig = this.props.data.find(r => r.url === recipe.url);
      return !orig;
    });

    return diffs.length > 0;
  }

  public componentDidUpdate() {
    if (!this.chart) {
      return;
    }

    this.chart.data = createBarChartData(this.props.data);
    this.chart.update();
  }

  public render() {
    return (
      <div className="full-stat-chart">
        <canvas ref={node => (this.node = node)} />
      </div>
    );
  }
}

function createBarChartData(data: RecipeData[]): ChartData {
  return {
    datasets: data.map(
      ({ nutrition, name }): ChartDataSets => {
        const { FAT, CHOCDF, PROCNT } = nutrition.perWeight;

        return {
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          data: [
            parseFloat(FAT.quantity.toFixed(2)),
            parseFloat(CHOCDF.quantity.toFixed(2)),
            parseFloat(PROCNT.quantity.toFixed(2))
          ],
          label: name.length > 15 ? `${name.substr(0, 15)}...` : name
        };
      }
    ),
    labels: ["Fat", "Carbs", "Protein"]
  };
}

const colors = [
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#990099",
  "#3B3EAC",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
  "#994499",
  "#22AA99",
  "#AAAA11",
  "#6633CC",
  "#E67300",
  "#8B0707",
  "#329262",
  "#5574A6",
  "#3B3EAC"
];

export default FullStatChart;
