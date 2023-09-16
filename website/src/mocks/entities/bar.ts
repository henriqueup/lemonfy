import type { Bar } from "@entities/bar";
import { type Note, NOTE_DURATIONS } from "@entities/note";
import { SECONDS_PER_MINUTE } from "src/utils/timeEvaluation";
import { createNoteMock } from "src/mocks/entities/note";

export const createBarMock = (
  trackCount: number,
  beatCount: number,
  dibobinador: number,
  start: number,
  tempo: number,
  index?: number,
): Bar => ({
  trackCount,
  beatCount,
  dibobinador,
  capacity: beatCount / dibobinador,
  start,
  startInSeconds: (start * dibobinador) / (tempo / SECONDS_PER_MINUTE),
  tempo,
  tracks: Array.from({ length: trackCount }, (): Note[] => []),
  timeRatio: tempo / SECONDS_PER_MINUTE,
  index: index || 0,
});

export const getEmptyMockBar = (): Bar => ({
  index: 0,
  beatCount: 3,
  dibobinador: 4,
  start: 1,
  capacity: 3 / 4,
  tempo: 40,
  timeRatio: 40 / SECONDS_PER_MINUTE,
  trackCount: 3,
  tracks: [[], [], []],
});

export const getFilledMockBar = (): Bar => ({
  index: 0,
  beatCount: 4,
  dibobinador: 4,
  start: 0,
  capacity: 1,
  tempo: 100,
  timeRatio: 100 / SECONDS_PER_MINUTE,
  trackCount: 3,
  tracks: [
    [createNoteMock(NOTE_DURATIONS["HALF"], 0), createNoteMock(NOTE_DURATIONS["HALF"], 1 / 2)],
    [
      createNoteMock(NOTE_DURATIONS["QUARTER"], 0),
      createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4),
      createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4),
      createNoteMock(NOTE_DURATIONS["QUARTER"], 3 / 4),
    ],
    [
      createNoteMock(NOTE_DURATIONS["HALF_TRIPLET"], 0),
      createNoteMock(NOTE_DURATIONS["HALF_TRIPLET"], 1 / 3),
      createNoteMock(NOTE_DURATIONS["HALF_TRIPLET"], 2 / 3),
    ],
  ],
});
