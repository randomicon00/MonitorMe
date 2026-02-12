import type { GetServerSidePropsContext } from "next";

import { requireAuth } from "utils/auth";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import { useState, ReactElement, MouseEvent } from "react";

import Table from "../components/Table";
import mapEventToGrid, { GriddableEvent } from "../utils/mapEvent";
import { eventColumnNames } from "data/columns";
import { PER_PAGE, QUERY_PARAM_KEYS } from "utils/constants";
import { getPageNumber, paginate } from "utils/common";

interface EventsProps {
    spansBySegment: {
        rows: any[];
        numOfItems: number;
        currentPage: number;
    };
    eventsBySegment: {
        rows: any[];
        numOfItems: number;
        currentPage: number;
    };
}

const Segments: NextPageWithLayout<EventsProps> = ({
    spansBySegment,
    eventsBySegment,
}) => {
    return (
        <div className="mt-8">
            <div className="flex flex-row justify-between items-center max-w-8xl  px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-medium leading-6 text-gray-900">
                    Segments
                </h2>
            </div>

            <div className="flex flex-col xl:flex-row">
                <div className="w-full xl:w-3/4">
                    <Table
                        title="Spans"
                        columns={eventColumnNames}
                        rows={spansBySegment.rows}
                        numOfItems={spansBySegment.numOfItems}
                        currentPage={spansBySegment.currentPage}
                        perPage={PER_PAGE}
                        queryParam={QUERY_PARAM_KEYS.span}
                        enablePagination={true}
                    />
                </div>
                <div className="w-full xl:w-3/4">
                    <Table
                        title="Events"
                        columns={eventColumnNames}
                        rows={eventsBySegment.rows}
                        numOfItems={eventsBySegment.numOfItems}
                        currentPage={eventsBySegment.currentPage}
                        perPage={PER_PAGE}
                        queryParam={QUERY_PARAM_KEYS.event}
                        enablePagination={true}
                    />
                </div>
            </div>
        </div>
    );
};

Segments.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Segments;

export const getServerSideProps = requireAuth(
    async (context: GetServerSidePropsContext) => {
        const { query } = context;

        const currentPageSpans = getPageNumber(query[QUERY_PARAM_KEYS.span]);
        const currentPageEvents = getPageNumber(query[QUERY_PARAM_KEYS.event]);

        // Fetch spans
        const respSpan = await fetch(`http://localhost:3000/api/spans_by_segment`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const { data: spansData } = await respSpan.json();
        const spans = spansData?.spans ?? [];
        const spansNumOfItems = spans.length;

        const griddableSpans = spans.map(mapEventToGrid);
        const paginatedSpans = paginate(griddableSpans, currentPageSpans, PER_PAGE);

        // Fetch events
        const respEvents = await fetch(
            `http://localhost:3000/api/events_by_segment`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        const { data: eventsData } = await respEvents.json();
        const events = eventsData?.events ?? [];
        const eventsNumOfItems = events.length;

        const griddableEvents = events.map(mapEventToGrid);
        const paginatedEvents = paginate(
            griddableEvents,
            currentPageEvents,
            PER_PAGE
        );

        return {
            props: {
                spansBySegment: {
                    rows: paginatedSpans,
                    numOfItems: spansNumOfItems,
                    currentPage: currentPageSpans,
                },
                eventsBySegment: {
                    rows: paginatedEvents,
                    numOfItems: eventsNumOfItems,
                    currentPage: currentPageEvents,
                },
            },
        };
    }
);
