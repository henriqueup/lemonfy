import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { TopbarMenu } from "src/components";
import { Toaster } from "@/components/ui/Toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

export const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="h-screen bg-background text-popover-foreground">
      <ErrorBoundary>
        <TopbarMenu />
        <div className="h-full bg-inherit pt-8 text-inherit">
          <Component {...pageProps} />
        </div>
        <Toaster />
      </ErrorBoundary>
    </div>
  );
};

export default api.withTRPC(MyApp);
