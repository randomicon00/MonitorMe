import type { GetServerSidePropsContext } from "next";
import Layout from "components/Layout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import { requireAuth } from "utils/auth";
import Table from "components/Table";
import { eventIssuesColumnNames, spanIssuesColumnNames } from "data/columns";
import { QUERY_PARAM_KEYS, PER_PAGE } from "utils/constants";
import { getPageNumber, paginate } from "utils/common";
import {
  getErrorSpan,
  getErrorEvent,
  mapSpanIssueToGrid,
  mapEventIssueToGrid,
} from "../utils/issues";

interface IssuesProps {
  spanIssues: {
    rows: Record<string, any>[];
    pages: number;
    numOfItems: number;
    currentPage: number;
  };
  eventIssues: {
    rows: Record<string, any>[];
    pages: number;
    numOfItems: number;
    currentPage: number;
  };
}

const Issues: NextPageWithLayout<IssuesProps> = ({
  spanIssues,
  eventIssues,
}) => {
  return (
    <div className="mt-8">
      <div className="flex flex-row justify-between items-center max-w-6xl  px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium leading-6 text-gray-900">Issues</h2>
      </div>
      <div id="spans-issues-table" className="flex flex-col">
        <Table
          title="Span Issues"
          columns={spanIssuesColumnNames}
          rows={spanIssues.rows}
          numOfItems={spanIssues.numOfItems}
          currentPage={spanIssues.currentPage}
          perPage={PER_PAGE}
          queryParam={QUERY_PARAM_KEYS.span}
          handleRowClick={() => {}}
          enablePagination={true}
        />
      </div>
      <div id="events-issues-table" className="flex flex-col">
        <Table
          title="Event Issues"
          columns={eventIssuesColumnNames}
          rows={eventIssues.rows}
          numOfItems={eventIssues.numOfItems}
          currentPage={eventIssues.currentPage}
          perPage={PER_PAGE}
          queryParam={QUERY_PARAM_KEYS.event}
          handleRowClick={() => {}}
          enablePagination={true}
        />
      </div>
    </div>
  );
};

Issues.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Issues;

export const getServerSideProps = requireAuth(
  async (context: GetServerSidePropsContext) => {
    const { query } = context;

    let resp;

    // Process spans issues
    const currentSpanPage = getPageNumber(query[QUERY_PARAM_KEYS.span]);
    resp = await fetch(`http://localhost:3000/api/spans2`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const spansResp = await resp.json();
    const spans = spansResp.data.spans;

    const spanIssues = spans.filter(getErrorSpan);
    const spanIssuesRows = spanIssues.map(mapSpanIssueToGrid);
    const spanIssuesRowsPaginated = paginate(
      spanIssuesRows,
      currentSpanPage,
      PER_PAGE
    );

    // Process event issues
    const currentEventPage = getPageNumber(query[QUERY_PARAM_KEYS.event]);
    resp = await fetch(`http://localhost:3000/api/events2`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const eventsResp = await resp.json();
    const events = eventsResp.data.events;

    const eventIssues = events.filter(getErrorEvent);
    const eventIssuesRows = eventIssues.map(mapEventIssueToGrid);

    const eventIssuesRowsPaginated = paginate(
      eventIssuesRows,
      currentEventPage,
      PER_PAGE
    );

    return {
      props: {
        spanIssues: {
          rows: spanIssuesRowsPaginated,
          numOfItems: spanIssues.length,
          currentPage: currentSpanPage,
        },
        eventIssues: {
          rows: eventIssuesRowsPaginated,
          numOfItems: eventIssues.length,
          currentPage: currentEventPage,
        },
      },
    };
  }
);
