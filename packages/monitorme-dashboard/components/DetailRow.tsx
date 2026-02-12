import React, { ReactNode } from "react";

type DetailRowProps = {
    label: string;
    value: ReactNode;
};

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
    <div className="py-2 sm:py-3 border-t border-gray-200 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-xs font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-xs font-medium text-gray-700 sm:mt-0 sm:col-span-2">
            {value ?? "N/A"}
        </dd>
    </div>
);

export default DetailRow;
