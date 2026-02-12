import type { GetServerSidePropsContext } from "next";
import { requireAuth } from "utils/auth";
import Layout from "../components/Layout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import { PRIVACY_DATA } from "data/privacy";

type PrivacyProps = {
    privacyText: Array<{ title: string; paragraph: string }>;
};

const Privacy: NextPageWithLayout<PrivacyProps> = ({ privacyText }) => {
    return (
        <div className="mt-8">
            <div className="flex flex-row justify-between items-center max-w-8xl  px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-medium leading-6 text-gray-900">Privacy</h2>
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {privacyText.map((privacy) => (
                    <div
                        key={privacy.title}
                        className="mb-4 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
                    >
                        <h3 className="text-md font-bold mb-2">{privacy.title}</h3>
                        <p className="text-sm">{privacy.paragraph}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Privacy;

Privacy.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth(
    async (_context: GetServerSidePropsContext) => {
        // Fetch the privacy data (e.g., from constants or an API)
        const privacyText = PRIVACY_DATA;

        return {
            props: { privacyText },
        };
    }
);
