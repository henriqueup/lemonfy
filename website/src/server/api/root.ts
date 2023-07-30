import { songRouter } from "@routers/song";
import { instrumentRouter } from "@routers/instrument";
import { createTRPCRouter, domainWrapper } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  instrument: instrumentRouter,
  song: songRouter,
});

export const routerCaller = appRouter.createCaller({ domainWrapper });

// export type definition of API
export type AppRouter = typeof appRouter;
