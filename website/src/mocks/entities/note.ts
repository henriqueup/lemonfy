import type { Note } from "@entities/note";
import type { Pitch } from "@entities/pitch";

export const createNoteMock = (
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
