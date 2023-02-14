import type { Note } from "@entities/note";

export const createNoteMock = (duration: number, start: number): Note => ({
  duration,
  start,
  hasSustain: false,
  isSustain: false,
});
