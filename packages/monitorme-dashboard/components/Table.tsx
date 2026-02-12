import React, { MouseEvent } from "react";
import {
    CashIcon,
    ChevronRightIcon,
    AdjustmentsIcon,
    CameraIcon,
} from "@heroicons/react/solid";
import { truncateString, classNames } from "utils/common";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/outline";

type Code = string | undefined;

const getTextColor = (code: Code) => {
    const codeStr = String(code);
    if (!codeStr) return "text-green-500";

    const firstDigit = codeStr.charAt(0);
    if (firstDigit === "4" || firstDigit === "5") {
        return "text-red-500";
    } else {
        return "text-green-500";
    }
};

const getBorderColor = (code: Code) => {
    const codeStr = String(code);
    if (!codeStr) return `border-green-500`;

    const firstDigit = codeStr.charAt(0);
    if (firstDigit === "4" || firstDigit === "5") {
        return `border-red-500`;
    } else {
        return `border-green-500`;
    }
};

type TableProps = {
    title: string;
    columns: string[];
    rows: Record<string, any>[];
    numOfItems?: number;
    currentPage?: number;
    pages?: number;
    perPage?: number;
    queryParam?: string;
    handleRowClick?: (event: MouseEvent<HTMLElement>) => void;
    enablePagination: boolean;
};

type PaginationProps = {
    currentPage: number;
    numOfItems: number;
    perPage: number;
    queryParam: string;
};

const Pagination = ({
    currentPage,
    numOfItems,
    perPage,
    queryParam,
}: PaginationProps) => {
    const lastPage = Math.ceil(numOfItems / perPage);

    return (
        <nav
            className="bg-white px-2 py-2 flex items-center justify-between border shadow rounded-b-lg border-gray-200 sm:px-6 "
            aria-label="Pagination"
        >
            <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{(currentPage - 1) * perPage + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                        {Math.min(numOfItems, currentPage * perPage)}
                    </span>{" "}
                    of <span className="font-medium">{numOfItems}</span> results
                </p>
            </div>

            <div className="flex-1 flex justify-end">
                {currentPage !== 1 && (
                    <Link href={`?${queryParam}=${currentPage - 1}`} legacyBehavior>
                        <a className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
                            Previous
                        </a>
                    </Link>
                )}
                {currentPage !== lastPage && (
                    <Link href={`?${queryParam}=${currentPage + 1}`} legacyBehavior>
                        <a className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
                            Next
                        </a>
                    </Link>
                )}
            </div>
        </nav>
    );
};

const Table = (props: TableProps) => {
    const {
        title,
        columns,
        rows,
        numOfItems,
        currentPage,
        perPage,
        queryParam, // Added to manage multiple tables in the same page
        handleRowClick,
        enablePagination = true,
    } = props;

    const displayTableRow = (row: any) => {
        return (
            <tr
                key={`${row.id}`}
                data-id={`${row.id}`}
                className="bg-white hover:bg-gray-200"
                onClick={(e) => {
                    handleRowClick && handleRowClick(e);
                }}
            >
                {columns?.map((col, idx) => {
                    if (col?.toLowerCase() === "type") {
                        // Determine the icon based on the type
                        let IconComponent;
                        if (row[col] === "Span") {
                            IconComponent = AdjustmentsIcon;
                        } else if (row[col] === "Event") {
                            IconComponent = EyeIcon;
                        } else if (row[col] === "Snapshot") {
                            IconComponent = CameraIcon;
                        }

                        return (
                            <td
                                key={idx}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center space-x-2"
                            >
                                {IconComponent && (
                                    <IconComponent
                                        className="h-5 w-5 text-indigo-500"
                                        aria-hidden="true"
                                    />
                                )}
                                <span>{row[col]}</span>
                            </td>
                        );
                    }

                    if (col?.toLowerCase() === "statuscode") {
                        const statusCode = row["statusCode"];
                        const statusCodeDigit = parseInt(statusCode);
                        const isValidStatusCode =
                            statusCodeDigit >= 200 && statusCodeDigit < 600;

                        return (
                            <td
                                key={idx}
                                className="hidden px-6 py-4 whitespace-nowrap text-sm text-gray-900 md:block"
                            >
                                {isValidStatusCode && (
                                    <span
                                        className={classNames(
                                            getTextColor(statusCode),
                                            getBorderColor(statusCode),
                                            "border-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-medium font-medium font-semibold capitalize"
                                        )}
                                    >
                                        {statusCode}
                                    </span>
                                )}
                            </td>
                        );
                    } else if (col?.toLowerCase() === "typeoferror") {
                        return (
                            <td
                                key={idx}
                                className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-semibold"
                            >
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-red-100">
                                    {row[col] ?? ""}
                                </span>
                            </td>
                        );
                    } else if (col === "datetime") {
                        return (
                            <td
                                key={idx}
                                className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900"
                            >
                                <time dateTime={row[col]}>{row["date"] ?? "Unknown Date"}</time>
                            </td>
                        );
                    } else if (col === "id") {
                        return (
                            <td
                                key={idx}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                                {truncateString(row[col] ?? "", { numChars: 10 })}{" "}
                            </td>
                        );
                    } else {
                        return (
                            <td
                                key={idx}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                                {row[col] ?? ""}
                            </td>
                        );
                    }
                })}
            </tr>
        );
    };

    return (
        <div>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mt-8 text-md leading-6 font-medium text-gray-900">
                    {title}
                </h2>
            </div>

            {/* Activity list (smallest breakpoint only) */}
            <div className="shadow sm:hidden">
                <ul
                    role="list"
                    className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden"
                >
                    {rows?.map((event: any) => (
                        <li key={event.id}>
                            <a
                                href={event.href}
                                className="block px-4 py-4 bg-white hover:bg-gray-50"
                            >
                                <span className="flex items-center space-x-4">
                                    <span className="flex-1 flex space-x-2 truncate">
                                        <CashIcon
                                            className="flex-shrink-0 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                        <span className="flex flex-col text-gray-500 text-sm truncate">
                                            <span className="truncate">{event.name}</span>
                                            <span>
                                                <span className="text-gray-900 font-medium">
                                                    {event.amount}
                                                </span>{" "}
                                                {event.currency}
                                            </span>
                                            <time dateTime={event.datetime}>{event.date}</time>
                                        </span>
                                    </span>
                                    <ChevronRightIcon
                                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </a>
                        </li>
                    ))}{" "}
                    ?? <div>No data available</div>
                </ul>

                <nav
                    className="bg-white px-4 py-3 flex items-center justify-between border border-gray-200"
                    aria-label="Pagination"
                >
                    <div className="flex-1 flex justify-between">
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
                        >
                            Previous
                        </a>
                        <a
                            href="#"
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
                        >
                            Next
                        </a>
                    </div>
                </nav>
            </div>

            {/* Activity table (small breakpoint and up) */}
            <div className="hidden sm:block">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
                    <div className="flex flex-col mt-2">
                        <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        {columns?.map((name, idx) => (
                                            <th
                                                key={idx}
                                                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rows && rows.length > 0 ? (
                                        rows.map((elem) => displayTableRow(elem))
                                    ) : (
                                        <tr>
                                            <td colSpan={columns.length} className="text-center">
                                                No rows data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            {/* FIXME: condition */}
                            {enablePagination &&
                                currentPage !== undefined &&
                                numOfItems !== undefined &&
                                perPage !== undefined &&
                                queryParam !== undefined && (
                                    <Pagination
                                        currentPage={currentPage}
                                        numOfItems={numOfItems}
                                        perPage={perPage}
                                        queryParam={queryParam}
                                    />
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
