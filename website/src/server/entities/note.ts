import { type Pitch } from "./pitch";

export type NoteDurationName =
  | "LONG"
  | "DOUBLE_WHOLE"
  | "WHOLE"
  | "HALF"
  | "HALF_TRIPLET"
  | "QUARTER"
  | "QUARTER_TRIPLET"
  | "EIGHTH"
  | "EIGHTH_TRIPLET"
  | "SIXTEENTH";
export const NOTE_DURATION: Record<NoteDurationName, number> = {
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

//note without a pitch is silence
export type Note = {
  duration: number;
  pitch?: Pitch;
  start?: number;
  hasSustain: boolean;
  isSustain: boolean;
  durationInSeconds?: number;
  startInSeconds?: number;
};

export const createNote = (duration: number, pitch?: Pitch, hasSustain?: boolean, isSustain?: boolean) => ({
  duration,
  pitch,
  hasSustain: hasSustain || false,
  isSustain: isSustain || false,
});

export const sumNotesDuration = (notes: Note[]) =>
  notes.reduce((currentDuration, currentNote) => currentDuration + currentNote.duration, 0);
