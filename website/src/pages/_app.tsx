import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { TopbarMenu } from "src/components";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="h-screen bg-background text-popover-foreground">
      <TopbarMenu />
      <div className="h-full bg-inherit pt-8 text-inherit">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default api.withTRPC(MyApp);
