import { z } from "zod";

import SheetModule, { SheetSchema } from "@entities/sheet";
import { type Pitch, PitchSchema } from "@/server/entities/pitch";

export const BaseInstrumentSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1),
  type: z.enum(["String", "Key", "Wind", "Percussion"]),
  trackCount: z.number().int().min(1),
  tuning: z.array(PitchSchema),
  isFretted: z.boolean(),
});

export const instrumentRefineCallback = (
  value: z.infer<typeof BaseInstrumentSchema>,
  ctx: z.RefinementCtx,
) => {
  console.log(value);
  if (
    (value.type !== "Key" && value.tuning.length !== value.trackCount) ||
    (value.type === "Key" && value.tuning.length !== 1)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["tuning"],
      message:
        "An Instrument's tuning should match it's track count, except for 'Key' Instruments which should only have a base key.",
    });
  }
};

export const InstrumentInfoSchema = BaseInstrumentSchema.merge(
  z.object({
    id: z.string().cuid(),
  }),
).superRefine(instrumentRefineCallback);

export const InstrumentSchema = BaseInstrumentSchema.merge(
  z.object({
    sheet: SheetSchema.optional(),
  }),
).superRefine(instrumentRefineCallback);

export type InstrumentInfo = z.infer<typeof InstrumentInfoSchema>;
export type Instrument = z.infer<typeof InstrumentSchema>;

interface IInstrumentModule {
  createInstrument: (
    name: string,
    type: string,
    trackCount: number,
    tuning: Pitch[],
    isFretted: boolean,
    id?: string,
  ) => Instrument;
}

const InstrumentModule: IInstrumentModule = {
  createInstrument: (
    name: string,
    type: string,
    trackCount: number,
    tuning: Pitch[],
    isFretted: boolean,
    id?: string,
  ) => {
    const sheet = SheetModule.createSheet(trackCount);

    return InstrumentSchema.parse({
      id,
      name,
      type,
      trackCount,
      tuning,
      isFretted,
      sheet,
    });
  },
};

export default InstrumentModule;
