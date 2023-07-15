import { z } from "zod";

import { SongSchema } from "@entities/song";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const songRouter = createTRPCRouter({
  save: publicProcedure.input(SongSchema).mutation(({ input, ctx }) => {
    return ctx.domainWrapper.Song.save(input);
  }),
  list: publicProcedure.input(z.undefined()).query(async ({ ctx }) => {
    // await new Promise(res => setTimeout(res, 2000));
    return ctx.domainWrapper.Song.list();
  }),
  get: publicProcedure.input(z.string().cuid()).query(({ input, ctx }) => {
    return ctx.domainWrapper.Song.get(input);
  }),
  deleteMany: publicProcedure
    .input(z.array(z.string().cuid()))
    .mutation(({ input, ctx }) => {
      void ctx.domainWrapper.Song.deleteMany(input);
    }),
});
