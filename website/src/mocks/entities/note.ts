import type { default as BarModule, Bar } from "@entities/bar";
import type { Note } from "@entities/note";
import type { Pitch } from "@entities/pitch";

export const createNoteMock = (
  duration: number,
  start: number,
  pitch?: Pitch,
  hasSustain?: boolean,
  isSustain?: boolean,
  bar?: Bar,
): Note => {
  let startInSeconds: number | undefined;
  let durationInSeconds: number | undefined;

  if (bar) {
    const convertDurationInBarToSeconds =
      jest.requireActual<typeof BarModule>("@entities/bar").convertDurationInBarToSeconds;
    startInSeconds = convertDurationInBarToSeconds(bar, start);
    durationInSeconds = convertDurationInBarToSeconds(bar, duration);
  }

  return {
    duration,
    start,
    pitch,
    hasSustain: hasSustain || false,
    isSustain: isSustain || false,
    startInSeconds,
    durationInSeconds,
  };
};
