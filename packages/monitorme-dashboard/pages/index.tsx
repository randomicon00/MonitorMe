import React, { ReactElement } from "react";
import type { GetServerSidePropsContext } from "next";

import { requireAuth } from "utils/auth";
import Table from "components/Table";
import Card from "components/Card";

import { cards } from "data/menu";
import { lastestColumnNames } from "data/columns";
import { mapDataToTableFields } from "utils/mapData";
import { getTotalErrors } from "utils/issues";

import Layout from "../components/Layout";
import type { NextPageWithLayout } from "./_app";
import { useSession } from "next-auth/react";

interface HomeProps {
    rows: Record<string, any>[];
    cardCounts: Record<string, any>[];
}

const displayCards = (cards: any[], cardCounts: Record<string, any>) => {
    return cards.map((card) => {
        const cardCount = cardCounts?.[card.id];
        if (cardCount) {
            card = {
                ...card,
                count: cardCount,
            };
        }

        return <Card key={card.name} {...card} />;
    });
};

const Home: NextPageWithLayout<HomeProps> = ({ rows, cardCounts }) => {
    return (
        <div className="mt-8">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl leading-6 font-medium text-gray-900">
                    Overview
                </h2>
                <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card */}
                    {displayCards(cards, cardCounts)}
                </div>
            </div>

            <Table
                title="Recent Activity"
                columns={lastestColumnNames}
                rows={rows}
                enablePagination={false}
            />
        </div>
    );
};

export default Home;

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth(
    async (_context: GetServerSidePropsContext) => {
        const [spansResp, eventsResp, latestResp] = await Promise.all([
            fetch("http://localhost:3000/api/spans2"),
            fetch("http://localhost:3000/api/events2"),
            fetch("http://localhost:3000/api/latest"),
        ]);

        const [{ data: spansData }, { data: eventsData }, { data: latestData }] =
            await Promise.all([
                spansResp.json(),
                eventsResp.json(),
                latestResp.json(),
            ]);

        const { spans: spansArr } = spansData;
        const { events: eventsArr } = eventsData;

        const { spans, events, snapshots } = latestData ?? {};

        const { backendErrors: backend, clientErrors: frontend } = getTotalErrors(
            spansArr ?? [],
            eventsArr ?? []
        );

        const traces = spansArr.length + eventsArr.length;

        const rows = [
            ...spans?.map((span: any) => mapDataToTableFields(span, "Span")),
            ...events?.map((event: any) => mapDataToTableFields(event, "Event")),
            ...snapshots?.map((snapshot: any) =>
                mapDataToTableFields(snapshot, "Snapshot")
            ),
        ].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return {
            props: {
                rows,
                cardCounts: {
                    frontend,
                    backend,
                    traces,
                },
            },
        };
    }
);
