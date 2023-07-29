import { z } from "zod";

import SheetModule, { SheetSchema } from "@entities/sheet";
import { type Pitch, PitchSchema } from "@/server/entities/pitch";

export const BaseInstrumentSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1),
  type: z.enum(["String", "Key", "Wind", "Percussion"]),
  trackCount: z.number().int().min(1),
  tunning: z.array(PitchSchema),
  isFretted: z.boolean(),
});

export const InstrumentInfoSchema = BaseInstrumentSchema.merge(
  z.object({
    id: z.string().cuid(),
  }),
);

export const InstrumentSchema = BaseInstrumentSchema.merge(
  z.object({
    sheet: SheetSchema.optional(),
  }),
);

export type InstrumentInfo = z.infer<typeof InstrumentInfoSchema>;
export type Instrument = z.infer<typeof InstrumentSchema>;

interface IInstrumentModule {
  createInstrument: (
    name: string,
    type: string,
    trackCount: number,
    tunning: Pitch[],
    isFretted: boolean,
    id?: string,
  ) => Instrument;
}

const InstrumentModule: IInstrumentModule = {
  createInstrument: (
    name: string,
    type: string,
    trackCount: number,
    tunning: Pitch[],
    isFretted: boolean,
    id?: string,
  ) => {
    const sheet = SheetModule.createSheet(trackCount);

    return InstrumentSchema.parse({
      id,
      name,
      type,
      trackCount,
      tunning,
      isFretted,
      sheet,
    });
  },
};

export default InstrumentModule;
