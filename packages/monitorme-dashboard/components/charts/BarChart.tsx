import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  ChartTypeRegistry,
  registerables,
  ChartData,
  ScatterDataPoint,
  BubbleDataPoint,
} from "chart.js";

//import { createBarChartData } from "../../utils/chartdata";

/*
const labels = ["January", "February", "March", "April", "May", "June"];
const data = {
  labels: labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};*/

export type ChartDataObject = ChartData<"bar", object[]>;

export type GenericBarChartData = ChartData<
  keyof ChartTypeRegistry,
  (number | ScatterDataPoint | BubbleDataPoint | null)[],
  unknown
>;

type BarChartProps = {
  barChartData: GenericBarChartData;
  barChartOptions: object;
};

export const extractTraceId = (span: any) => span?.traceId ?? "0";

const BarChart = ({ barChartData, barChartOptions }: BarChartProps) => {
  const config = {
    type: "bar" as keyof ChartTypeRegistry,
    data: barChartData, // [[1, 2], [3, 4], [5, 6]
    options: {
      maintainAspectRatio: false,
      aspectRatio: 2,
      axis: "y", // < -- this inverts the bars to horizontal
      ...barChartOptions, // Merging additional options via props
    },
  };

  const ref = useRef(null);
  const [chart, setChart] = useState<Chart | null>(null);
  const counter = useRef(0);

  const handleClick = (e: any) => {
    e.preventDefault();

    if (ref.current) {
      const myChart = new Chart(ref.current, config);
      setChart(myChart);
    }
  };

  useEffect(() => {
    Chart.register(...registerables);

    if (ref.current && !chart) {
      const myChart = new Chart(ref.current, config);
      setChart(myChart);
    }
    return () => {
      chart?.destroy();
      ref.current = null;
    };
  }, [chart]);

  return <canvas ref={ref} style={{ width: "30vw", height: "30vh" }} />;
};

export default BarChart;
