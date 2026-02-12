import type { GetServerSidePropsContext } from "next";
import { requireAuth } from "utils/auth";
import Layout from "components/Layout";
import { useState, ReactElement, MouseEvent } from "react";
import { NextPageWithLayout } from "./_app";
import Table from "components/Table";
import { spanColumnNames } from "data/columns";
import SpanDetails from "components/SpanDetails";
import mapSpanToGrid, { GridSpan } from "utils/mapSpan";
import { getPageNumber, paginate } from "utils/common";
import { PER_PAGE, QUERY_PARAM_KEYS } from "utils/constants";

interface SpansProps {
  rows: any[];
  numOfItems: number;
  currentPage: number;
  firstSpanId: string;
}

const Spans: NextPageWithLayout<SpansProps> = ({
  rows,
  numOfItems,
  currentPage,
  firstSpanId,
}) => {
  const [spanId, setSpanId] = useState(firstSpanId);

  const handleRowClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    // Using currentTarget ensures you get the element to which the event handler
    // is attached (<tr> in this case), whereas target can give you the innermost
    // clicked element (e.g., <td>). This ensures data-id is reliably fetched.
    const id = event.currentTarget.getAttribute("data-id") || "";
    setSpanId(id);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-row justify-between items-center max-w-8xl  px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium leading-6 text-gray-900">Spans</h2>
      </div>
      <div className="flex flex-col xl:flex-row">
        <div className="w-full xl:w-3/4">
          <Table
            title=""
            columns={spanColumnNames}
            rows={rows}
            numOfItems={numOfItems}
            currentPage={currentPage}
            handleRowClick={handleRowClick}
            perPage={PER_PAGE}
            queryParam="spanpage"
            enablePagination={true}
          />
        </div>
        {/* TODO: Test this component! */}
        {spanId && (
          <div className="px-8 mt-4 xl:mt-2 xl:px-2 w-full xl:w-1/4">
            <SpanDetails spanId={spanId} />
          </div>
        )}
      </div>
    </div>
  );
};

Spans.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Spans;

export const getServerSideProps = requireAuth(
  async (context: GetServerSidePropsContext) => {
    const { query } = context;
    const pageNumber = getPageNumber(query[QUERY_PARAM_KEYS.span]);

    const resp = await fetch(`http://localhost:3000/api/spans2`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // TODO: Ensure that data is correct!
    const { data } = await resp.json();
    //console.log("Data: ", data);
    const { spans, numOfItems } = data ?? {};

    //console.log("First Span:", JSON.stringify(spans[0]));

    if (!numOfItems) {
      return {
        props: {
          rows: [],
          numOfItems: 0,
          currentPage: 1,
          firstSpanId: "",
        } as Record<string, any>,
      };
    }

    //console.log(`*********************** Number of Items: ${!numOfItems}`);
    // Apply mapSpanToGrid to transform spans
    const griddableSpans: GridSpan[] = spans.map(mapSpanToGrid);

    // Paginate spans
    const griddablePaginatedSpans: GridSpan[] = paginate(
      griddableSpans,
      pageNumber,
      PER_PAGE
    );

    let firstSpanId =
      griddablePaginatedSpans && griddablePaginatedSpans.length > 0
        ? griddablePaginatedSpans[0].id
        : "";

    return {
      props: {
        rows: griddablePaginatedSpans,
        numOfItems,
        currentPage: pageNumber,
        firstSpanId,
      } as Record<string, any>,
    };
  }
);
