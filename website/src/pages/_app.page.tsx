import { type AppType } from "next/app";
import Head from "next/head";

import "../styles/globals.css";
import { api } from "../utils/api";
import { ErrorBoundary, LoadingSpinner, TopbarMenu } from "src/components";
import { Toaster } from "@/components/ui/Toaster";
import { useGlobalStore } from "@/store/global";

export const MyApp: AppType = ({ Component, pageProps }) => {
  const { isLoading } = useGlobalStore();

  return (
    <div className="h-screen bg-background text-popover-foreground">
      <Head>
        <title>Lemonfy</title>
      </Head>
      <ErrorBoundary>
        <TopbarMenu />
        <div className="h-[calc(100%_-_32px)] text-inherit">
          <Component {...pageProps} />
        </div>
        <Toaster />
        {isLoading ? (
          <div className="absolute left-0 top-0 z-[60] h-screen w-full">
            <LoadingSpinner className="bg-background/80 backdrop-blur-sm transition-opacity" />
          </div>
        ) : null}
      </ErrorBoundary>
    </div>
  );
};

export default api.withTRPC(MyApp);
