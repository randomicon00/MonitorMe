import { createBarChartData } from "../../utils/chartdata";
import BarChart, { extractTraceId } from "./BarChart";
import type { GenericBarChartData, ChartDataObject } from "./BarChart";
import { useState } from "react";

type SpanChartProps = {
    data: any[];
    onBarClick: (spanId: string) => void;
};

const SpanChart = ({ data, onBarClick }: SpanChartProps) => {
    const traceId = extractTraceId(data[0]);
    const barChartData: ChartDataObject = createBarChartData(data, "Spans");

    //const [clickedData, setClickedData] = useState<any>(null);

    const barChartOptions = {
        indexAxis: "y",
        aspectRatio: 100,
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
        onClick(_event: any, elements: any[]) {
            if (elements.length > 0) {
                const clickedElement = elements[0];
                const index = clickedElement.index;
                const spanId = barChartData?.labels?.[index] as string;
                alert(spanId);
                onBarClick(spanId)
            }
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

export default SpanChart;
