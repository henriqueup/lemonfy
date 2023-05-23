import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { TopbarMenu } from "src/components";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="h-screen bg-stone-300 text-stone-600 dark:bg-stone-900 dark:text-stone-400">
      <TopbarMenu />
      <div className="h-full bg-inherit pt-8 text-inherit">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default api.withTRPC(MyApp);
