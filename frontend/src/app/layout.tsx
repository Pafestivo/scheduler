import { NextAuthProvider } from "../components/Provider";
import "../styles/normalize.css";
import { GlobalContextProvider } from "./context/store";
import Navbar from "@/components/Navbar";
import AlertBar from "@/components/AlertSnackbar";
import Head from "next/head";
import GlobalSpinner from "@/components/GlobalSpinner";
import I18nMiddleware from "@/components/I18nMiddleware";
import { inter } from "./fonts";
import "@/styles/globals.css";

export const metadata = {
  title: "Meet4Meet",
  description: "Schedule your workload",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className={inter.className}>
        <Head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&family=Merriweather:ital,wght@1,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <NextAuthProvider>
          <GlobalContextProvider>
            <I18nMiddleware />
            <Navbar />
            {children}
            <AlertBar />
            <GlobalSpinner />
          </GlobalContextProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
