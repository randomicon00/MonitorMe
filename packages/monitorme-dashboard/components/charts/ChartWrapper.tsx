import React from "react";
import SpanChart from "components/charts/SpanChart";

interface ChartWrapperProps {
    data: Record<string, any>[];
    title: string;
    onBarClick: (spanId: string) => void;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
    data,
    title,
    onBarClick,
}) => {
    return (
        <div className="w-full">
            <h3 className="text-md font-medium text-gray-900 mb-4">{title}</h3>
            <div className="bg-white shadow rounded-lg p-4">
                <SpanChart data={data} onBarClick={onBarClick} />
            </div>
        </div>
    );
};

export default ChartWrapper;
