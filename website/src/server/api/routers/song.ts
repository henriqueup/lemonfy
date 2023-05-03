import { SongSchema } from "@entities/song";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const songRouter = createTRPCRouter({
  create: publicProcedure.input(SongSchema).mutation(async ({ input, ctx }) => {
    await ctx.domainWrapper.Song.create(input);
  }),
});
