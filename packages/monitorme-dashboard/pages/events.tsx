import type { GetServerSidePropsContext } from "next";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import { useState, ReactElement, MouseEvent } from "react";
import { requireAuth } from "utils/auth";
import Table from "../components/Table";
import EventDetails from "../components/EventDetails";
import mapEventToGrid, { GriddableEvent } from "../utils/mapEvent";
import { eventColumnNames } from "data/columns";
import { PER_PAGE, QUERY_PARAM_KEYS } from "utils/constants";
import { getPageNumber, paginate } from "utils/common";

interface EventsProps {
    rows: any[];
    pages: number;
    numOfItems: number;
    currentPage: number;
    firstEventId: string;
}

const Events: NextPageWithLayout<EventsProps> = ({
    rows,
    numOfItems,
    currentPage,
    firstEventId,
}) => {
    const [eventId, setEventId] = useState(firstEventId);

    const handleRowClick = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        // Using currentTarget ensures you get the element to which the event handler
        // is attached (<tr> in this case), whereas target can give you the innermost
        // clicked element (e.g., <td>). This ensures data-id is reliably fetched.
        const id = event.currentTarget.getAttribute("data-id") || "";
        setEventId(id);
    };

  
    return (
        <div className="mt-8">
            <div className="flex flex-row justify-between items-center max-w-8xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-medium leading-6 text-gray-900">Events</h2>
            </div>
            <div className="flex flex-col xl:flex-row">
                <div className="w-full xl:w-3/4">
                    <Table
                        title=""
                        columns={eventColumnNames}
                        rows={rows}
                        numOfItems={numOfItems}
                        currentPage={currentPage}
                        handleRowClick={handleRowClick}
                        perPage={PER_PAGE}
                        queryParam={QUERY_PARAM_KEYS.event}
                        enablePagination={true}
                    />
                </div>
                {eventId && (
                    <div className="px-8 mt-4 xl:mt-2 xl:px-2 w-full xl:w-1/4">
                        <EventDetails eventId={eventId} />
                    </div>
                )}
            </div>
        </div>
    );
};

Events.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Events;

export const getServerSideProps = requireAuth(
    async (context: GetServerSidePropsContext) => {
        const { query } = context;
        const pageNumber = getPageNumber(query[QUERY_PARAM_KEYS.event]);

        const resp = await fetch(`http://localhost:3000/api/events2`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { data } = await resp.json();
        const { events, numOfItems } = data ?? {};

        if (!numOfItems) {
            return {
                props: {
                    rows: null,
                    numOfItems: 0,
                    currentPage: 1,
                    firstSpanId: null,
                } as Record<string, any>,
            };
        }

        const griddableEvents: GriddableEvent[] = events.map(mapEventToGrid);

        const griddablePaginatedEvents: GriddableEvent[] = paginate(
            griddableEvents,
            pageNumber,
            PER_PAGE
        );

        let firstEventId =
            griddablePaginatedEvents && griddablePaginatedEvents.length > 0
                ? griddablePaginatedEvents[0].id
                : "";

        return {
            props: {
                rows: griddablePaginatedEvents,
                numOfItems,
                currentPage: pageNumber,
                firstEventId,
            } as Record<string, any>,
        };
    }
);
