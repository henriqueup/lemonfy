import { z } from "zod";

import { toPrecision } from "src/utils/numbers";
import { PitchSchema, type Pitch } from "./pitch";

const NOTE_DURATION_NAMES = [
  "LONG",
  "DOUBLE_WHOLE",
  "WHOLE",
  "HALF",
  "HALF_TRIPLET",
  "QUARTER",
  "QUARTER_TRIPLET",
  "EIGHTH",
  "EIGHTH_TRIPLET",
  "SIXTEENTH",
] as const;

export const NoteDurationNameSchema = z.enum(NOTE_DURATION_NAMES);
export type NoteDurationName = z.infer<typeof NoteDurationNameSchema>;

export const NOTE_DURATIONS: Record<NoteDurationName, number> = {
  LONG: 4,
  DOUBLE_WHOLE: 2,
  WHOLE: 1,
  HALF: 1 / 2,
  HALF_TRIPLET: 1 / 3,
  QUARTER: 1 / 4,
  QUARTER_TRIPLET: 1 / 6,
  EIGHTH: 1 / 8,
  EIGHTH_TRIPLET: 1 / 12,
  SIXTEENTH: 1 / 16,
} as const;

const getNextNoteDuration = (
  currentDuration: NoteDurationName,
  isRaise: boolean,
) => {
  const currentDurationIndex = NOTE_DURATION_NAMES.indexOf(currentDuration);
  const nextNoteDuration = isRaise
    ? NOTE_DURATION_NAMES[currentDurationIndex - 1]
    : NOTE_DURATION_NAMES[currentDurationIndex + 1];

  if (NoteDurationNameSchema.safeParse(nextNoteDuration).success)
    return nextNoteDuration;

  return currentDuration;
};

export const getHigherNoteDuration = (currentDuration: NoteDurationName) =>
  getNextNoteDuration(currentDuration, true);
export const getLowerNoteDuration = (currentDuration: NoteDurationName) =>
  getNextNoteDuration(currentDuration, false);

export const NoteSchema = z.object({
  duration: z.number().min(0),
  start: z.number().min(0),
  pitch: PitchSchema,
  hasSustain: z.boolean().default(false),
  isSustain: z.boolean().default(false),
  durationInSeconds: z.number().min(0).optional(),
  startInSeconds: z.number().min(0).optional(),
});

export type Note = z.infer<typeof NoteSchema>;

export const createNote = (
  duration: number,
  start: number,
  pitch: Pitch,
  hasSustain?: boolean,
  isSustain?: boolean,
): Note =>
  NoteSchema.parse({
    duration: toPrecision(duration),
    start: toPrecision(start),
    pitch,
    hasSustain: hasSustain || false,
    isSustain: isSustain || false,
  });

export const sumNotesDuration = (notes: Note[]) =>
  toPrecision(
    notes.reduce(
      (currentDuration, currentNote) => currentDuration + currentNote.duration,
      0,
    ),
  );
