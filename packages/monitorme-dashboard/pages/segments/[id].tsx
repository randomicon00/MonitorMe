import type { GetServerSidePropsContext } from "next";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "./../_app";
import Layout from "components/Layout";
import Table from "components/Table";
import ChartWrapper from "components/charts/ChartWrapper";
import Button from "components/Button";
import { requireAuth } from "utils/auth";
import mapSpanToGrid from "utils/mapSpan";
import mapEventToGrid from "utils/mapEvent";
import { getSpansAndEventsBySegmentId } from "utils/segment";
import { getPageNumber, paginate } from "utils/common";
import { spanColumnNames, eventColumnNames } from "data/columns";
import { QUERY_PARAM_KEYS, PER_PAGE } from "utils/constants";
import { useRouter } from "next/router";
import { PlayIcon } from "@heroicons/react/solid";
import SpanDetails from "components/SpanDetails";

interface SpansEventsBySegmentProps {
  sortedSpans: Record<string, any>[];
  paginatedGriddableSpans: Record<string, any>[];
  paginatedGriddableEvents: Record<string, any>[];
  numOfSpans: number;
  numOfEvents: number;
  spansPageNumber: number;
  eventsPageNumber: number;
  segmentId: string;
}

const SpansEventsBySegment: NextPageWithLayout<SpansEventsBySegmentProps> = (
  props
) => {
  const {
    sortedSpans,
    paginatedGriddableSpans,
    paginatedGriddableEvents,
    numOfSpans,
    numOfEvents,
    spansPageNumber,
    eventsPageNumber,
    segmentId,
  } = props;

  const router = useRouter();
  const [selectedSpanId, setSelectedSpanId] = useState<string>(
    paginatedGriddableSpans[0]?.id
  );

  const handleBarClick = (spanId: string) => {
    setSelectedSpanId(spanId);
  };

  const goToPlayer = () => {
    router.push(`/session_replay/${segmentId}`);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-row justify-between items-center max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="my-8 text-xl leading-6 font-medium text-gray-900">
          Segment <span className="text-sm">{segmentId}</span>
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

      <div className="flex flex-col max-w-8xl mx-auto">
        {/* Responsive layout for spans-chart and span-details */}
        {sortedSpans && sortedSpans.length > 0 && (
          <div className="grid mt-8 w-full mx-auto grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Spans Chart */}
            <div id="spans-chart" className="w-full lg:col-span-2">
              <div className="w-full mx-auto pl-4 sm:pl-6 lg:pl-8">
                <ChartWrapper
                  data={sortedSpans}
                  onBarClick={handleBarClick}
                  title="Spans by Segment"
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

        {/* Tables for Spans and Events */}
        {paginatedGriddableSpans && paginatedGriddableSpans.length > 0 && (
          <div id="spans">
            <Table
              title="Spans"
              columns={spanColumnNames}
              rows={paginatedGriddableSpans}
              numOfItems={numOfSpans}
              currentPage={spansPageNumber}
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
              currentPage={eventsPageNumber}
              perPage={PER_PAGE}
              queryParam={QUERY_PARAM_KEYS.event}
              enablePagination={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};


/*
  return (
    <div className="mt-8">
     <div className="flex flex-row justify-between items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="my-8 text-lg leading-6 font-medium text-gray-900">
          Segment <span className="text-sm ">{segmentId}</span>
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
      <div className="flex flex-col">
        <div className="grid gap-8">
          <div id="spans-chart" className="w-full">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <ChartWrapper data={sortedSpans} title="Spans by Segment" />
            </div>
          </div>
          <div id="spans" className="w-full">
            <Table
              title="Spans"
              columns={spanColumnNames}
              rows={paginatedGriddableSpans}
              numOfItems={numOfSpans}
              currentPage={spansPageNumber}
              perPage={PER_PAGE}
              queryParam={QUERY_PARAM_KEYS.span}
              enablePagination={true}
            />
          </div>
          <div id="events" className="w-full">
            <Table
              title="Events"
              columns={eventColumnNames}
              rows={paginatedGriddableEvents}
              numOfItems={numOfEvents}
              currentPage={eventsPageNumber}
              perPage={PER_PAGE}
              queryParam={QUERY_PARAM_KEYS.event}
              enablePagination={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
*/

export const getServerSideProps = requireAuth(
  async (context: GetServerSidePropsContext) => {
    const { query } = context;

    const segmentId = query.id;
    const currentSpanPage = getPageNumber(query[QUERY_PARAM_KEYS.span]);
    const currentEventPage = getPageNumber(query[QUERY_PARAM_KEYS.event]);

    try {
      // Fetch spans and events
      const [spans, events] = await getSpansAndEventsBySegmentId(segmentId);

      // Defensive checks for fetched data, provide default values if undefined
      const validSpans = Array.isArray(spans) ? spans : [];
      const validEvents = Array.isArray(events) ? events : [];

      // If both spans and events are missing, consider returning a 404 or empty props
      if (validSpans.length === 0 && validEvents.length === 0) {
        return {
          props: {
            sortedSpans: [],
            paginatedGriddableSpans: [],
            paginatedGriddableEvents: [],
            numOfSpans: 0,
            numOfEvents: 0,
            spansPageNumber: currentSpanPage,
            eventsPageNumber: currentEventPage,
            segmentId,
          },
        };
      }

      // Calculate number of spans and events
      const numOfSpans = validSpans.length;
      const numOfEvents = validEvents.length;

      // Sort and paginate spans and events
      const sortedSpans = validSpans.sort(
        (a: Record<string, any>, b: Record<string, any>) =>
          a.timeSent - b.timeSent
      );

      const paginatedGriddableSpans = paginate(
        validSpans.map(mapSpanToGrid),
        currentSpanPage,
        PER_PAGE
      );

      const paginatedGriddableEvents = paginate(
        validEvents.map(mapEventToGrid),
        currentEventPage,
        PER_PAGE
      );

      return {
        props: {
          sortedSpans,
          paginatedGriddableSpans,
          paginatedGriddableEvents,
          numOfSpans,
          numOfEvents,
          spansPageNumber: currentSpanPage,
          eventsPageNumber: currentEventPage,
          segmentId,
        },
      };
    } catch (error) {
      console.error("Error fetching spans and events:", error);

      return {
        props: {
          sortedSpans: [],
          paginatedGriddableSpans: [],
          paginatedGriddableEvents: [],
          numOfSpans: 0,
          numOfEvents: 0,
          spansPageNumber: currentSpanPage,
          eventsPageNumber: currentEventPage,
          segmentId,
        },
      };
    }
  }
);

SpansEventsBySegment.getLayout = (page: ReactElement) => (
  <Layout>{page}</Layout>
);

export default SpansEventsBySegment;
