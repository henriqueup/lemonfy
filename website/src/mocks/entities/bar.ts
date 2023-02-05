import { type Bar, SECONDS_PER_MINUTE } from "@entities/bar";
import { createNote, NOTE_DURATIONS } from "@entities/note";

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
    [createNote(NOTE_DURATIONS["HALF"], 0), createNote(NOTE_DURATIONS["HALF"], 1 / 2)],
    [
      createNote(NOTE_DURATIONS["QUARTER"], 0),
      createNote(NOTE_DURATIONS["QUARTER"], 1 / 4),
      createNote(NOTE_DURATIONS["QUARTER"], 2 / 4),
      createNote(NOTE_DURATIONS["QUARTER"], 3 / 4),
    ],
    [
      createNote(NOTE_DURATIONS["HALF_TRIPLET"], 0),
      createNote(NOTE_DURATIONS["HALF_TRIPLET"], 1 / 3),
      createNote(NOTE_DURATIONS["HALF_TRIPLET"], 2 / 3),
    ],
  ],
});
