import Image from "next/image";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import SignInForm from "../components/SignInForm";
import type { NextPageWithLayout } from "./_app";

const SignInPage: NextPageWithLayout = () => {
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-10">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-6">
            <Image
              src="/images/logo2.svg"
              alt="Workflow"
              width={80}
              height={80}
            />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome to MonitorMe, the ultimate monitoring tool.
          </h2>
          <p className="mt-4 text-center text-sm text-gray-600">
            Log in or use{" "}
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              admin@admin.com / 123456
            </span>{" "}
            to explore our features.
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
};

export default SignInPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return {
    props: {},
  };
}
