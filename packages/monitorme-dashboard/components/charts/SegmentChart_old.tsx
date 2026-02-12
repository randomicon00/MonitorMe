import { createBarChartData } from "../../utils/chartdata";
import BarChart, {
  ChartDataObject,
  GenericBarChartData,
  extractTraceId,
} from "./BarChart";

type SegmentChartProps = {
  data: any[];
};

const SegmentChart = ({ data }: SegmentChartProps) => {
  const traceId = extractTraceId(data[0]);
  const barChartData: ChartDataObject = createBarChartData(data, "Spans");

  const barChartOptions = {
    //type: "bar",
    indexAxis: "y",
    aspectRatio: 6,
    scales: {
      x: {
        title: {
          display: true,
          text: "Duration (ms)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Span Id",
        },
      },
    },
    onClick(e: any) {
      //e.preventDefault();
      // TODO: complete this function
      alert("Hello world!");
    },
  };

  return (
    <div className="max-h-96">
      <h4>Trace {traceId}</h4>
      <BarChart
        barChartData={barChartData as GenericBarChartData}
        barChartOptions={barChartOptions}
      />
    </div>
  );
};

export default SegmentChart;
