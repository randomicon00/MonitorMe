import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Layout from "../components/Layout";
import { SessionProvider } from "next-auth/react";
import { NextComponentType } from "next";

import { ReactNode, ReactElement } from "react";

//type Component
// How to type the component for it to work as intended.
//https://dev.to/ofilipowicz/next-js-per-page-layouts-and-typescript-lh5

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const { session } = pageProps;

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}

export default MyApp;
