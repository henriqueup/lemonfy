import { type Pitch } from "./pitch";

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

export type NoteDurationName = (typeof NOTE_DURATION_NAMES)[number];

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

const isNoteDuration = (key: string | undefined): key is NoteDurationName =>
  key ? NOTE_DURATIONS.hasOwnProperty(key) : false;

const getNextNoteDuration = (currentDuration: NoteDurationName, isRaise: boolean) => {
  const currentDurationIndex = NOTE_DURATION_NAMES.indexOf(currentDuration);
  const nextNoteDuration = isRaise
    ? NOTE_DURATION_NAMES[currentDurationIndex - 1]
    : NOTE_DURATION_NAMES[currentDurationIndex + 1];

  if (isNoteDuration(nextNoteDuration)) return nextNoteDuration;

  return currentDuration;
};

export const getHigherNoteDuration = (currentDuration: NoteDurationName) => getNextNoteDuration(currentDuration, true);
export const getLowerNoteDuration = (currentDuration: NoteDurationName) => getNextNoteDuration(currentDuration, false);

export type Note = {
  duration: number;
  start: number;
  pitch?: Pitch; //note without a pitch is silence
  hasSustain: boolean;
  isSustain: boolean;
  durationInSeconds?: number;
  startInSeconds?: number;
};

export const createNote = (
  duration: number,
  start: number,
  pitch?: Pitch,
  hasSustain?: boolean,
  isSustain?: boolean,
): Note => ({
  duration,
  start,
  pitch,
  hasSustain: hasSustain || false,
  isSustain: isSustain || false,
});

export const sumNotesDuration = (notes: Note[]) =>
  notes.reduce((currentDuration, currentNote) => currentDuration + currentNote.duration, 0);
