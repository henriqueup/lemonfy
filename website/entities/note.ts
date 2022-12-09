import Pitch from "./pitch";

export const NoteDuration = {
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

export type NoteDuration = typeof NoteDuration[keyof typeof NoteDuration];

//note without a pitch is silence
export default class Note {
  duration: NoteDuration;
  pitch?: Pitch;
  start?: number;
  isSustain: boolean;
  durationInSeconds?: number;
  startInSeconds?: number;

  constructor(duration: NoteDuration, pitch?: Pitch, isSustain?: boolean) {
    this.duration = duration;
    this.pitch = pitch;
    this.isSustain = isSustain || false;
  }

  static sumNotesDuration(notes: Note[]) {
    return notes.reduce((currentDuration, currentNote) => currentDuration + currentNote.duration, 0);
  }
}
