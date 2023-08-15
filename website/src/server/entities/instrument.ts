import { z } from "zod";

import { SheetSchema, createSheet } from "@entities/sheet";
import { type Pitch, PitchSchema } from "@/server/entities/pitch";

export const INSTRUMENT_TYPES = [
  "String",
  "Key",
  "Wind",
  "Percussion",
] as const;
export const DISABLED_INSTRUMENT_TYPES = ["Wind", "Percussion"];

const InstrumentTypeSchema = z.enum(INSTRUMENT_TYPES);

const BaseInstrumentSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  type: InstrumentTypeSchema,
  trackCount: z.number().int().min(1),
  tuning: z.array(PitchSchema),
  isFretted: z.boolean(),
});

const instrumentRefineCallback = (
  value: Partial<z.infer<typeof BaseInstrumentSchema>>,
  ctx: z.RefinementCtx,
) => {
  if (
    (value.type !== "Key" && value.tuning?.length !== value.trackCount) ||
    (value.type === "Key" && value.tuning?.length !== 1)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["tuning"],
      message:
        "An Instrument's tuning should match it's track count, except for 'Key' Instruments which should only have a base key.",
    });
  }
};

export const InstrumentInfoSchema = BaseInstrumentSchema.superRefine(
  instrumentRefineCallback,
);
export const InstrumentSchema = BaseInstrumentSchema.merge(
  z.object({
    sheet: SheetSchema.optional(),
  }),
).superRefine(instrumentRefineCallback);
export const InstrumentCreateSchema = BaseInstrumentSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    sheet: SheetSchema.optional(),
  }),
).superRefine(instrumentRefineCallback);

export type InstrumentType = z.infer<typeof InstrumentTypeSchema>;
export type InstrumentInfo = z.infer<typeof InstrumentInfoSchema>;
export type InstrumentCreate = z.infer<typeof InstrumentCreateSchema>;
export type Instrument = z.infer<typeof InstrumentSchema>;

export const createInstrument = (
  name: string,
  type: string,
  trackCount: number,
  tuning: Pitch[],
  isFretted: boolean,
  id?: string,
): InstrumentCreate => {
  const sheet = createSheet(trackCount);

  return InstrumentCreateSchema.parse({
    id,
    name,
    type,
    trackCount,
    tuning,
    isFretted,
    sheet,
  });
};
