import { createBar } from "@entities/bar";
import { createNote, NOTE_DURATIONS } from "@entities/note";
import type { Sheet } from "@entities/sheet";

export const getEmptyMockSheet = (): Sheet => ({
  bars: [],
  trackCount: 3,
  tracks: [[], [], []],
  noteToAdd: null,
});

export const getMockSheetWithBars = (): Sheet => ({
  bars: [createBar(3, 3, 4, 0, 70, 0), createBar(3, 4, 4, 3 / 4, 50, 1), createBar(3, 6, 8, 1 + 3 / 4, 120, 2)],
  trackCount: 3,
  tracks: [[], [], []],
  noteToAdd: null,
});

export const getMockSheetWithNoGap = (): Sheet => ({
  bars: [createBar(3, 3, 4, 0, 70, 0)],
  trackCount: 3,
  tracks: [
    [
      createNote(NOTE_DURATIONS["QUARTER"], 0),
      createNote(NOTE_DURATIONS["QUARTER"], 1 / 4),
      createNote(NOTE_DURATIONS["QUARTER"], 1 / 2),
    ],
    [],
    [],
  ],
  noteToAdd: null,
});

export const getMockSheetWithGap = (): Sheet => ({
  bars: [createBar(3, 3, 4, 0, 70, 0), createBar(3, 4, 4, 3 / 4, 70, 0)],
  trackCount: 3,
  tracks: [
    [],
    [
      createNote(NOTE_DURATIONS["QUARTER"], 0),
      createNote(NOTE_DURATIONS["QUARTER"], 2 / 4),
      createNote(NOTE_DURATIONS["QUARTER"], 3 / 4),
      createNote(NOTE_DURATIONS["QUARTER"], 5 / 4),
    ],
    [],
  ],
  noteToAdd: null,
});
