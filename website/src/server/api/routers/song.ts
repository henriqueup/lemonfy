import { SongSchema } from "@entities/song";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const songRouter = createTRPCRouter({
  create: publicProcedure.input(SongSchema).mutation(({ input, ctx }) => {
    ctx.domainWrapper.Song.create(input);
  }),
});
