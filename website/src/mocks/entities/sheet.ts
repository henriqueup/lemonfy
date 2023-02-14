/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NOTE_DURATIONS } from "@entities/note";
import type { Sheet } from "@entities/sheet";
import { createBarMock } from "src/mocks/entities/bar";
import { createNoteMock } from "src/mocks/entities/note";

export const getEmptyMockSheet = (): Sheet => ({
  bars: [],
  trackCount: 3,
  tracks: [[], [], []],
  noteToAdd: null,
});

export const getMockSheetWithBars = (): Sheet => ({
  bars: [createBarMock(3, 3, 4, 0, 70), createBarMock(3, 4, 4, 3 / 4, 50), createBarMock(3, 6, 8, 1 + 3 / 4, 120)],
  trackCount: 3,
  tracks: [[], [], []],
  noteToAdd: null,
});

export const getMockSheetWithNoGap = (): Sheet => ({
  bars: [createBarMock(3, 3, 4, 0, 70)],
  trackCount: 3,
  tracks: [
    [
      createNoteMock(NOTE_DURATIONS["QUARTER"], 0),
      createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4),
      createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4),
    ],
    [],
    [],
  ],
  noteToAdd: null,
});

export const getMockSheetWithGap = (): Sheet => {
  const sheet: Sheet = {
    bars: [createBarMock(3, 3, 4, 0, 70), createBarMock(3, 4, 4, 3 / 4, 50)],
    trackCount: 3,
    tracks: [
      [],
      [
        createNoteMock(NOTE_DURATIONS["QUARTER"], 0),
        createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4),
        createNoteMock(NOTE_DURATIONS["QUARTER"], 3 / 4),
        createNoteMock(NOTE_DURATIONS["QUARTER"], 5 / 4),
      ],
      [],
    ],
    noteToAdd: null,
  };

  // sheet.bars[0]!.tracks[1] = [
  //   createNoteMock(NOTE_DURATIONS["QUARTER"], 0),
  //   createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4),
  //   createNoteMock(NOTE_DURATIONS["QUARTER"], 3 / 4),
  //   createNoteMock(NOTE_DURATIONS["QUARTER"], 5 / 4),
  // ];

  return sheet;
};
