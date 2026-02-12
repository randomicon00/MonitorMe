import type { GetServerSidePropsContext } from "next";
import { requireAuth } from "utils/auth";
import Layout from "../components/Layout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import { FAQ_DATA } from "data/faq";

type HelpProps = {
    helpText: Array<{ question: string; answer: string }>;
};

const Help: NextPageWithLayout<HelpProps> = ({ helpText }) => {
    return (
        <div className="mt-8">
            <div className="flex flex-row justify-between items-center max-w-8xl  px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-medium leading-6 text-gray-900">Help</h2>
            </div>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                {helpText.map((help) => (
                    <div
                        key={help.question}
                        className="mb-4 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
                    >
                        <h3 className="text-md font-bold mb-2">{help.question}</h3>
                        <p className="text-sm">{help.answer} </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Help;

Help.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth(
    async (_context: GetServerSidePropsContext) => {
        const helpText = FAQ_DATA;

        return {
            props: { helpText },
        };
    }
);
