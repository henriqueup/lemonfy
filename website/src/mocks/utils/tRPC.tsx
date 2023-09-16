import { type PropsWithChildren } from "react";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";

import { type AppRouter } from "src/server/api/root";
import { trpcConfig } from "src/utils/api";

// probably will need to change this when integration testing
global.fetch = jest.fn();

const url = `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;
const trpcReact = createTRPCReact<AppRouter>(trpcConfig);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

const trpcClient = trpcReact.createClient({
  links: [httpBatchLink({ url })],
  transformer: superjson,
});

export const withNextTRPC = ({ children }: PropsWithChildren<unknown>) => (
  <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </trpcReact.Provider>
);
