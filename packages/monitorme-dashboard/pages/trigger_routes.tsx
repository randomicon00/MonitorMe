import type { GetServerSidePropsContext } from "next";
import { requireAuth } from "utils/auth";
import Layout from "../components/Layout";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "./_app";
import { paginate } from "utils/common";
import Table from "../components/Table";
import { triggerRouteColumnNames } from "../data/columns";
import { filterTriggerRoute, mapTriggerRouteToGrid } from "../utils/mapTrigger";
import { PER_PAGE, QUERY_PARAM_KEYS } from "utils/constants";
import { getPageNumber } from "utils/common";

interface TriggerRoutesProps {
  rows: any[];
  numOfItems: number;
  currentPage: number;
}

const TriggerRoutes: NextPageWithLayout<TriggerRoutesProps> = ({
  rows,
  numOfItems,
  currentPage,
}) => {
  return (
    <div className="mt-8">
      <div className="flex flex-row justify-between items-center max-w-6xl  px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium leading-6 text-gray-900">
          Trigger Routes
        </h2>
      </div>
      <Table
        title=""
        columns={triggerRouteColumnNames}
        rows={rows}
        numOfItems={numOfItems}
        currentPage={currentPage}
        perPage={PER_PAGE}
        queryParam={QUERY_PARAM_KEYS.triggerroute}
        enablePagination={true}
      />
    </div>
  );
};

TriggerRoutes.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default TriggerRoutes;

export const getServerSideProps = requireAuth(
  async (context: GetServerSidePropsContext) => {
    const { query } = context;

    const pageNumber = getPageNumber(query[QUERY_PARAM_KEYS.triggerroute]);

    const response = await fetch("http://localhost:3000/api/trigger_routes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data } = await response.json();
    const { triggerRoutes, numOfItems } = data ?? {};

    if (!numOfItems) {
      return {
        props: {
          rows: [],
          numOfItems: 0,
          currentPage: 1,
        } as Record<string, any>,
      };
    }

    const griddableTriggerRoutes = triggerRoutes
      .filter(filterTriggerRoute)
      .map(mapTriggerRouteToGrid);

    const paginatedTriggerRoutes = paginate(
      griddableTriggerRoutes,
      pageNumber,
      PER_PAGE
    );

    return {
      props: {
        rows: paginatedTriggerRoutes,
        numOfItems,
        currentPage: pageNumber,
      } as Record<string, any>,
    };
  }
);
