import { exampleRouter } from "@routers/example";
import { songRouter } from "@routers/song";
import { createTRPCRouter, domainWrapper } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  song: songRouter,
});

export const routerCaller = appRouter.createCaller({ domainWrapper });

// export type definition of API
export type AppRouter = typeof appRouter;
