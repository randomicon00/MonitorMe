import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { ReactElement, MouseEvent } from "react";
import { NextPageWithLayout } from "./_app";
import { requireAuth } from "utils/auth";
import Layout from "components/Layout";
import Table from "components/Table";
import { getPageNumber, paginate } from "utils/common";
import { getSessionSummaries } from "utils/sessions";
import { PER_PAGE, QUERY_PARAM_KEYS } from "utils/constants";
import { sessionColumnNames } from "data/columns";

interface SessionsProps {
  columns: any[];
  rows: any[];
  pages: number;
  numOfItems: number;
  currentPage: number;
  firstSessionId: string;
}

const Sessions: NextPageWithLayout<SessionsProps> = ({
  rows,
  numOfItems,
  currentPage,
}) => {
  const router = useRouter();

  const handleRowClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    // Using currentTarget ensures you get the element to which the event handler
    // is attached (<tr> in this case), whereas target can give you the innermost
    // clicked element (e.g., <td>). This ensures data-id is reliably fetched.
    const id = event.currentTarget.getAttribute("data-id") || "";
    router.push(`/sessions/${id}`);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-row justify-between items-center max-w-8xl  px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium leading-6 text-gray-900">
          Sessions
        </h2>
      </div>
      <div className="w-full">
          <Table
            title=""
            columns={sessionColumnNames}
            rows={rows}
            numOfItems={numOfItems}
            currentPage={currentPage}
            handleRowClick={handleRowClick}
            perPage={PER_PAGE}
            queryParam={QUERY_PARAM_KEYS.session}
            enablePagination={true}
          />
      </div>
    </div>
  );
};

Sessions.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Sessions;

export const getServerSideProps = requireAuth(
  async (context: GetServerSidePropsContext) => {
    const { query } = context;

    const currentPage = getPageNumber(query[QUERY_PARAM_KEYS.session]);

    const resp = await fetch(`http://localhost:3000/api/events2`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data } = await resp.json();
    // parse the data fields of the events
    // TODO: this needs to be done at the backend/api level
    //const parsedData = parseData(data);
    // produce all session objects from the events
    const { events } = data ?? {};

    if (Object.keys(events).length === 0) {
      return {
        props: {
          rows: [],
          numOfItems: 0,
          currentPage: 1,
        } as Record<string, any>,
      };
    }

    const sessions = getSessionSummaries(events);
    const numOfItems = sessions.length;

    // Paginate the sessions for the current page
    const paginatedSessions = paginate(sessions, currentPage, PER_PAGE);

    return {
      props: {
        rows: paginatedSessions,
        numOfItems,
        currentPage,
      } as Record<string, any>,
    };
  }
);
