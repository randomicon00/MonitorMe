import React from "react";

interface SkeletonDetailsProps {
  rows: number;
}

const SkeletonRow: React.FC = () => (
  <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-4 border-t border-gray-200">
    <dt className="w-full">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
    </dt>
    <dd className="mt-1 sm:mt-0 sm:col-span-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
    </dd>
  </div>
);

const SkeletonDetails: React.FC<SkeletonDetailsProps> = ({ rows }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <SkeletonRow key={idx} />
      ))}
    </>
  );
};

export default SkeletonDetails;
