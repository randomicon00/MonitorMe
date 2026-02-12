import type { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import { requireAuth } from "utils/auth";
import Table from "components/Table";
import SpanChart from "components/charts/SpanChart";
import Layout from "components/Layout";
import { getPageNumber, paginate } from "utils/common";
import mapSpanToGrid from "utils/mapSpan";
import mapEventToGrid from "utils/mapEvent";
import mapSnapshotToGrid from "utils/mapSnapshot";
import { getDataBySesssionId } from "utils/session";
import { PER_PAGE, QUERY_PARAM_KEYS } from "utils/constants";
import {
    eventColumnNames,
    snapshotColumnNames,
    spanColumnNames,
} from "data/columns";
import Button from "components/Button";
import { PlayIcon } from "@heroicons/react/solid";
import ChartWrapper from "components/charts/ChartWrapper";
import SpanDetails from "components/SpanDetails";

type SessionProps = {
    spans: Record<string, any>[];
    paginatedGriddableSpans: Record<string, any>[];
    paginatedGriddableEvents: Record<string, any>[];
    paginatedGriddableSnapshots: Record<string, any>[];
    numOfSpans: number;
    numOfEvents: number;
    numOfSnapshots: number;
    currentSpansPage: number;
    currentEventsPage: number;
    currentSnapshotsPage: number;
    sessionId: string;
};

const Session: NextPageWithLayout<SessionProps> = (props: SessionProps) => {
    const {
        spans, //spanChartData,
        paginatedGriddableSpans,
        paginatedGriddableEvents,
        paginatedGriddableSnapshots,
        numOfSpans,
        numOfEvents,
        numOfSnapshots,
        currentSpansPage,
        currentEventsPage,
        currentSnapshotsPage,
        sessionId,
    } = props;

    const router = useRouter();

    const [selectedSpanId, setSelectedSpanId] = useState<string>(
        paginatedGriddableSpans[0]?.id
    );

    const handleBarClick = (spanId: string) => {
        setSelectedSpanId(spanId);
    };

    const goToPlayer = () => {
        router.push(`/session_replay/${sessionId}`);
    };

    return (
        <div className="mt-8">
            <div className="flex flex-row justify-between items-center max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="my-8 text-xl leading-6 font-medium text-gray-900">
                    Session <span className="text-sm ">{sessionId}</span>
                </h2>
                <div className="py-auto">
                    <Button
                        onClick={goToPlayer}
                        variant="primary"
                        Icon={PlayIcon}
                        iconPosition="right"
                    >
                        Play Replay
                    </Button>
                </div>
            </div>

            {/* Spans Chart, Spans, Events, Snapshots, Tables */}
            <div className="flex flex-col max-w-8xl mx-auto">
                {/* Responsive layout for spans-chart and span-details */}
                {spans && spans.length > 0 && (
                    <div className="grid mt-8 w-full mx-auto grid-cols-1 lg:grid-cols-3 gap-2 w-full">
                        {/* Spans Chart */}
                        <div id="spans-chart" className="w-full lg:col-span-2">
                            <div className="w-full mx-auto pl-4 sm:pl-6 lg:pl-8">
                                <ChartWrapper
                                    data={spans}
                                    onBarClick={handleBarClick}
                                    title="Spans by Session"
                                />
                            </div>
                        </div>

                        {/* Span Details */}
                        <div id="span-details" className="lg:col-span-1">
                            <div className="max-w-6xl mx-auto pr-4 sm:pr-6 lg:px-8">
                                {selectedSpanId && <SpanDetails spanId={selectedSpanId} />}
                            </div>
                        </div>
                    </div>
                )}

                {spans && spans.length > 0 && (
                    <div id="spans">
                        <Table
                            title="Spans"
                            columns={spanColumnNames}
                            rows={paginatedGriddableSpans}
                            numOfItems={numOfSpans}
                            currentPage={currentSpansPage}
                            perPage={PER_PAGE}
                            queryParam={QUERY_PARAM_KEYS.span}
                            enablePagination={true}
                        />
                    </div>
                )}
                {paginatedGriddableEvents && paginatedGriddableEvents.length > 0 && (
                    <div id="events">
                        <Table
                            title="Events"
                            columns={eventColumnNames}
                            rows={paginatedGriddableEvents}
                            numOfItems={numOfEvents}
                            currentPage={currentEventsPage}
                            perPage={PER_PAGE}
                            queryParam={QUERY_PARAM_KEYS.event}
                            enablePagination={true}
                        />
                    </div>
                )}
                {paginatedGriddableSnapshots &&
                    paginatedGriddableSnapshots.length > 0 && (
                        <div id="snapshots">
                            <Table
                                title="Snapshots"
                                columns={snapshotColumnNames}
                                rows={paginatedGriddableSnapshots}
                                numOfItems={numOfSnapshots}
                                currentPage={currentSnapshotsPage}
                                perPage={PER_PAGE}
                                queryParam={QUERY_PARAM_KEYS.snapshot}
                                enablePagination={true}
                            />
                        </div>
                    )}
            </div>
        </div>
    );
};

Session.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Session;

export const getServerSideProps = requireAuth(
    async (context: GetServerSidePropsContext) => {
        const { query } = context;

        // Validate sessionId
        const sessionId = query.id;

        // Extract current page numbers with a default of 1
        const currentSpansPage = getPageNumber(query[QUERY_PARAM_KEYS.span]) || 1;
        const currentEventsPage = getPageNumber(query[QUERY_PARAM_KEYS.event]) || 1;
        const currentSnapshotsPage =
            getPageNumber(query[QUERY_PARAM_KEYS.snapshot]) || 1;

        // span duration and start-time
        try {
            // Fetch session data
            const { events, snapshots, spans } =
                (await getDataBySesssionId(sessionId)) ?? {};

            // Calculate counts for each dataset
            const numOfSpans = spans.length;
            const numOfEvents = events.length;
            const numOfSnapshots = snapshots.length;
            // If all datasets are empty, return empty objects
            if (numOfSpans === 0 && numOfEvents === 0 && numOfSnapshots === 0) {
                return {
                    props: {
                        spanChartData: [], //filteredSpans: [],
                        //replayableEvents: [],
                        paginatedGriddableSpans: [],
                        paginatedGriddableEvents: [],
                        paginatedGriddableSnapshots: [],
                        numOfSpans: 0,
                        numOfEvents: 0,
                        numOfSnapshots: 0,
                        currentSpansPage,
                        currentEventsPage,
                        currentSnapshotsPage,
                        sessionId,
                    } as Record<string, any>,
                };
            }

            // Create Chart Data
            // const spanChartData = createBarChartData(filteredSpans);

            //console.log(spanChartData);

            // Sort snapshots
            const sortedSnapshots = snapshots.sort(
                (a: Record<string, any>, b: Record<string, any>) => a.id - b.id
            );

            // Paginate each dataset
            const paginatedGriddableSpans = paginate(
                spans.map(mapSpanToGrid),
                currentSpansPage,
                PER_PAGE
            );
            const paginatedGriddableEvents = paginate(
                events.map(mapEventToGrid),
                currentEventsPage,
                PER_PAGE
            );
            const paginatedGriddableSnapshots = paginate(
                sortedSnapshots.map(mapSnapshotToGrid),
                currentSnapshotsPage,
                PER_PAGE
            );

            //console.log(paginatedGriddableSpans);

            return {
                props: {
                    spans, //spanChartData,
                    paginatedGriddableSpans,
                    paginatedGriddableEvents,
                    paginatedGriddableSnapshots,
                    numOfSpans,
                    numOfEvents,
                    numOfSnapshots,
                    currentSpansPage,
                    currentEventsPage,
                    currentSnapshotsPage,
                    sessionId,
                } as Record<string, any>,
            };
        } catch (error) {
            console.error("Error fetching session data:", error);

            // If an error occurs, return empty props
            return {
                props: {
                    filteredSpans: [],
                    paginatedGriddableSpans: [],
                    paginatedGriddableEvents: [],
                    paginatedGriddableSnapshots: [],
                    numOfSpans: 0,
                    numOfEvents: 0,
                    numOfSnapshots: 0,
                    currentSpansPage,
                    currentEventsPage,
                    currentSnapshotsPage,
                    sessionId,
                } as Record<string, any>,
            };
        }
    }
);
