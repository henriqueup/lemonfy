import { Pitch } from "./pitch";

export enum NoteDuration {
  LONG = 4,
  DOUBLE_WHOLE = 2,
  WHOLE = 1,
  HALF = 1 / 2,
  HALF_TRIPLET = 1 / 3,
  QUARTER = 1 / 4,
  QUARTER_TRIPLET = 1 / 6,
  EIGHTH = 1 / 8,
  EIGHTH_TRIPLET = 1 / 12,
  SIXTEENTH = 1 / 16,
}

//note without a pitch is silence
export type Note = {
  duration: NoteDuration;
  pitch?: Pitch;
  start?: number;
  durationInSeconds?: number;
  startInSeconds?: number;
};

export const createNote = (duration: NoteDuration, pitch?: Pitch): Note => ({
  duration,
  pitch,
});
