import { type AppType } from "next/app";

import "../styles/globals.css";
import { api } from "../utils/api";
import { ErrorBoundary, LoadingSpinner, TopbarMenu } from "src/components";
import { Toaster } from "@/components/ui/Toaster";
import { useGlobalStore } from "@/store/global";

export const MyApp: AppType = ({ Component, pageProps }) => {
  const { isLoading } = useGlobalStore();

  return (
    <div className="h-screen bg-background text-popover-foreground">
      <ErrorBoundary>
        <TopbarMenu />
        <div className="h-[calc(100%_-_32px)] bg-inherit text-inherit">
          <Component {...pageProps} />
        </div>
        <Toaster />
        {isLoading ? (
          <div className="absolute left-0 top-0 z-[60] h-screen w-screen">
            <LoadingSpinner className="bg-background/80 backdrop-blur-sm transition-opacity" />
          </div>
        ) : null}
      </ErrorBoundary>
    </div>
  );
};

export default api.withTRPC(MyApp);
