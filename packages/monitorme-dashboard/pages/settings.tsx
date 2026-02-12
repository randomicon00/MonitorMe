import type { GetServerSidePropsContext } from "next";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
import { requireAuth } from "utils/auth";
import Layout from "../components/Layout";
import SettingsForm from "../components/SettingsForm";

const Settings: NextPageWithLayout = () => {
    return (
        <div className="mt-8">
            <div className="flex flex-row justify-between items-center max-w-8xl  px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-medium leading-6 text-gray-900">
                    Settings
                </h2>
            </div>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <SettingsForm />
            </div>
        </div>
    );
};

export default Settings;

Settings.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth(
    async (_context: GetServerSidePropsContext) => {
        return {
            props: {},
        };
    }
);
