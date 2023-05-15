import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { ThemeButton } from "src/components/themeButton";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="bg-stone-300 text-stone-600 dark:bg-stone-900 dark:text-stone-400">
      <div className="absolute bottom-0 right-0 m-4 bg-inherit">
        <ThemeButton />
      </div>
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
