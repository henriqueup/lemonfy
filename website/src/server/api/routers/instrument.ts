import { z } from "zod";

import { InstrumentCreateSchema } from "@entities/instrument";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const instrumentRouter = createTRPCRouter({
  save: publicProcedure
    .input(InstrumentCreateSchema)
    .mutation(({ input, ctx }) => {
      return ctx.domainWrapper.Instrument.save(input);
    }),
  list: publicProcedure.input(z.undefined()).query(async ({ ctx }) => {
    return ctx.domainWrapper.Instrument.list();
  }),
  // TODO
  // get: publicProcedure.input(z.string().cuid()).query(({ input, ctx }) => {
  //   return ctx.domainWrapper.Instrument.get(input);
  // }),
  deleteMany: publicProcedure
    .input(z.array(z.string().cuid()))
    .mutation(({ input, ctx }) => {
      void ctx.domainWrapper.Instrument.deleteMany(input);
    }),
});
