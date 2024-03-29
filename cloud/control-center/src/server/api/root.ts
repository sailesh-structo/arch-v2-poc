import { jobsRouter } from "~/server/api/routers/jobs";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  jobs: jobsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
