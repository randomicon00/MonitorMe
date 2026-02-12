import React, { useState } from "react";
import { CashIcon, ChevronRightIcon } from "@heroicons/react/solid";

import { statusStyles } from "../data/menu";

import { eventColumnNames, events } from "../data/data";

import { classNames } from "../utils/common";

import Router, { useRouter } from "next/router";

import Link from "next/link";
import { totalmem } from "os";

type StatusStyles = {
  success: string;
  processing: string;
  failed: string;
};

type StatusStylesKeys = keyof StatusStyles;

type TableProps = {
  title?: string;
  columns?: string[];
  data?: object[];
  numOfPages?: number;
};

const getBorderColor = (code) => {
  if (code.startsWith("2")) {
    return `border-green-500`;
  } else if (code.startsWith("3")) {
    return `border-yellow-500`;
  } else {
    return `border-red-500`;
  }
};

const Pagination = ({ currentPage, lastPage }) => {
  return (
    <nav
      className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{(currentPage - 1) * 10}</span>{" "}
          to <span className="font-medium">{currentPage * 10}</span> of{" "}
          <span className="font-medium">{lastPage * 10}</span> results
        </p>
      </div>

      <div className="flex-1 flex justify-between">
        {!currentPage === 1 && (
          <Link href={`?/page=${currentPage - 1}`} legacyBehavior>
            <a className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
              Previous
            </a>
          </Link>
        )}
        {!lastPage && (
          <Link href={`?/page=${currentPage + 1}`} legacyBehavior>
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
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const { title } = props;
  const [data, setData] = useState(null);

  return (
    <>
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        {title}
      </h2>
      {/* Activity list (smallest breakpoint only) */}
      <div className="shadow sm:hidden">
        <ul
          role="list"
          className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden"
        >
          {events.map((event) => (
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
          ))}
        </ul>

        <Pagination
          currentPage={Number(router.query.page)}
          lastPage={Math.ceil(100 / 20)}
        />
      </div>
      {/* Activity table (small breakpoint and up) */}
      <div className="hidden sm:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col mt-2">
            <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Span Id
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="hidden px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:block">
                      Segment Id
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Code
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trigger Route
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="bg-white hover:bg-gray-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex">
                          <a
                            href={event.href}
                            className="group inline-flex space-x-2 truncate text-sm"
                          >
                            <p className="text-gray-900 truncate group-hover:text-gray-500">
                              {event.spanid}
                            </p>
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                        <time dateTime={event.datetime}>{event.date}</time>
                      </td>
                      <td className="px-6 py-4 text-left  whitespace-nowrap text-sm text-gray-900">
                        {event.service}
                      </td>
                      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                        {event.segmentid}
                      </td>
                      <td className="hidden px-6 py-4 whitespace-nowrap text-sm text-gray-900 md:block">
                        <span
                          className={classNames(
                            statusStyles[
                              event.status as StatusStylesKeys
                            ] as any,
                            `${getBorderColor(
                              event.statuscode
                            )} border-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-medium font-medium font-semibold capitalize` as any
                          )}
                        >
                          {event.statuscode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                        {event.triggerroute}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <Pagination currentPage={4} totalItems={229} lastPage={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
