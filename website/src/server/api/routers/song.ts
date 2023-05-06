import { SongSchema } from "@entities/song";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const songRouter = createTRPCRouter({
  create: publicProcedure.input(SongSchema).mutation(async ({ input, ctx }) => {
    await ctx.domainWrapper.Song.create(input);
  }),
  list: publicProcedure.input(z.undefined()).query(({ ctx }) => {
    return ctx.domainWrapper.Song.list();
  }),
});
