import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";

type ServerSideProps<P> = (
  context: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<P>>;

export const requireAuth = <P extends Record<string, any>>(
  gssp: ServerSideProps<P>
) => {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "http://localhost:3000/signin",
          permanent: false,
        },
      };
    }

    return gssp(context);
  };
};
