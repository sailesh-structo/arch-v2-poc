import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { output } from "~/server/db/schema";

export const jobsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAllJobs: publicProcedure.query(async () => {
    console.log("getAllJobs");
    const result = await db.query.output.findMany({
      orderBy: [desc(output.timestamp)],
    });
    return result;
  }),
  getMachineJobs: publicProcedure
    .input(z.object({ machineId: z.string() }))
    .query(async ({ input }) => {
      console.log("getMachineJobs");
      const result = await db.query.output.findMany({
        where: eq(output.machineId, input.machineId),
        orderBy: [desc(output.timestamp)],
      });
      return result;
    }),
});
