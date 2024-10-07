import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./layout";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Layout>
        {/* <Navbar /> */}
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
