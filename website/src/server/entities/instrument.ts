import { z } from "zod";

import { SheetSchema, addNoteToSheet, createSheet } from "@entities/sheet";
import {
  type Pitch,
  NON_SILENT_PITCH_NAMES,
  NonSilentPitchSchema,
  createPitch,
} from "@/server/entities/pitch";
import { createNote, type Note } from "@/server/entities/note";

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
  tuning: z.array(NonSilentPitchSchema),
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

export const addNoteToFrettedInstrument = (
  instrument: Instrument,
  trackIndex: number,
  fret: number,
  duration: number,
  start: number,
): void => {
  if (!instrument.isFretted) throw new Error("Instrument must be fretted.");

  if (trackIndex >= instrument.trackCount) {
    throw new Error("Invalid track index.");
  }

  const basePitch = NonSilentPitchSchema.parse(instrument.tuning[trackIndex]);

  const indexOfBasePitch = NON_SILENT_PITCH_NAMES.indexOf(basePitch.name);
  const octavesHigher = Math.floor(
    (fret + indexOfBasePitch) / NON_SILENT_PITCH_NAMES.length,
  );
  const targetNameIndex =
    (fret + indexOfBasePitch) % NON_SILENT_PITCH_NAMES.length;

  const targetNote = createNote(
    duration,
    start,
    createPitch(
      NON_SILENT_PITCH_NAMES[targetNameIndex]!,
      basePitch.octave + octavesHigher,
    ),
  );
  addNoteToInstrument(instrument, trackIndex, targetNote);
};

export const addNoteToInstrument = (
  instrument: Instrument,
  trackIndex: number,
  note: Note,
): void => {
  if (instrument.sheet === undefined) {
    throw new Error("Instrument must have a Sheet.");
  }

  addNoteToSheet(instrument.sheet, trackIndex, note);
};
