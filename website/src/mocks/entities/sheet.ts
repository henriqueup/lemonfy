/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Bar } from "@entities/bar";
import { NOTE_DURATIONS } from "@entities/note";
import { createPitch } from "@entities/pitch";
import type { Sheet } from "@entities/sheet";
import { createBarMock } from "src/mocks/entities/bar";
import { createNoteMock } from "src/mocks/entities/note";

export const getEmptyMockSheet = (): Sheet => ({
  bars: [],
  trackCount: 3,
  tracks: [[], [], []],
});

export const getMockSheetWithBars = (): Sheet => ({
  bars: [createBarMock(3, 3, 4, 0, 70), createBarMock(3, 4, 4, 3 / 4, 50), createBarMock(3, 6, 8, 1 + 3 / 4, 120)],
  trackCount: 3,
  tracks: [[], [], []],
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
});

export const getMockSheetWithGap = (): Sheet => ({
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
});

export const getCompleteMoonlightSonataMockSheet = (): Sheet => {
  const bar1: Bar = createBarMock(3, 4, 4, 0, 54);
  const bar2: Bar = createBarMock(3, 4, 4, 1, 54);
  const bar3: Bar = createBarMock(3, 4, 4, 2, 54);
  const bar4: Bar = createBarMock(3, 4, 4, 3, 54);

  bar1.tracks[0] = [createNoteMock(NOTE_DURATIONS["WHOLE"], 0, createPitch("C#", 1), false, false, bar1)];
  bar1.tracks[1] = [createNoteMock(NOTE_DURATIONS["WHOLE"], 0, createPitch("C#", 2), false, false, bar1)];
  bar1.tracks[2] = [
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 0, createPitch("G#", 2), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 1 / 12, createPitch("C#", 3), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 2 / 12, createPitch("E", 3), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 3 / 12, createPitch("G#", 2), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 4 / 12, createPitch("C#", 3), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 5 / 12, createPitch("E", 3), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 6 / 12, createPitch("G#", 2), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 7 / 12, createPitch("C#", 3), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 8 / 12, createPitch("E", 3), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 9 / 12, createPitch("G#", 2), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 10 / 12, createPitch("C#", 3), false, false, bar1),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 11 / 12, createPitch("E", 3), false, false, bar1),
  ];

  bar2.tracks[0] = [createNoteMock(NOTE_DURATIONS["WHOLE"], 0, createPitch("B", 0), false, false, bar2)];
  bar2.tracks[1] = [createNoteMock(NOTE_DURATIONS["WHOLE"], 0, createPitch("B", 1), false, false, bar2)];
  bar2.tracks[2] = [
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 0, createPitch("G#", 2), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 1 / 12, createPitch("C#", 3), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 2 / 12, createPitch("E", 3), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 3 / 12, createPitch("G#", 2), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 4 / 12, createPitch("C#", 3), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 5 / 12, createPitch("E", 3), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 6 / 12, createPitch("G#", 2), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 7 / 12, createPitch("C#", 3), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 8 / 12, createPitch("E", 3), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 9 / 12, createPitch("G#", 2), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 10 / 12, createPitch("C#", 3), false, false, bar2),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 11 / 12, createPitch("E", 3), false, false, bar2),
  ];

  bar3.tracks[0] = [
    createNoteMock(NOTE_DURATIONS["HALF"], 0, createPitch("A", 0), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["HALF"], 0, createPitch("F#", 0), false, false, bar3),
  ];
  bar3.tracks[1] = [
    createNoteMock(NOTE_DURATIONS["HALF"], 0, createPitch("A", 1), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["HALF"], 0, createPitch("F#", 1), false, false, bar3),
  ];
  bar3.tracks[2] = [
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 0, createPitch("A", 2), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 1 / 12, createPitch("C#", 3), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 2 / 12, createPitch("E", 3), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 3 / 12, createPitch("A", 2), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 4 / 12, createPitch("C#", 3), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 5 / 12, createPitch("E", 3), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 6 / 12, createPitch("A", 2), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 7 / 12, createPitch("D", 3), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 8 / 12, createPitch("F#", 3), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 9 / 12, createPitch("A", 2), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 10 / 12, createPitch("D", 3), false, false, bar3),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 11 / 12, createPitch("F#", 3), false, false, bar3),
  ];

  bar4.tracks[0] = [createNoteMock(NOTE_DURATIONS["WHOLE"], 0, createPitch("G#", 0), false, false, bar4)];
  bar4.tracks[1] = [createNoteMock(NOTE_DURATIONS["WHOLE"], 0, createPitch("G#", 1), false, false, bar4)];
  bar4.tracks[2] = [
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 0, createPitch("G#", 2), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 1 / 12, createPitch("C", 3), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 2 / 12, createPitch("F#", 3), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 3 / 12, createPitch("G#", 2), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 4 / 12, createPitch("C#", 3), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 5 / 12, createPitch("E", 3), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 6 / 12, createPitch("G#", 2), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 7 / 12, createPitch("C#", 3), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 8 / 12, createPitch("D#", 3), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 9 / 12, createPitch("F#", 2), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 10 / 12, createPitch("C", 3), false, false, bar4),
    createNoteMock(NOTE_DURATIONS["EIGHTH_TRIPLET"], 11 / 12, createPitch("D#", 3), false, false, bar4),
  ];

  const sheet: Sheet = {
    bars: [bar1, bar2, bar3, bar4],
    trackCount: 3,
    tracks: [
      [
        ...bar1.tracks[0],
        ...bar2.tracks[0].map(note => ({ ...note, start: note.start + bar2.start })),
        ...bar3.tracks[0].map(note => ({ ...note, start: note.start + bar3.start })),
        ...bar4.tracks[0].map(note => ({ ...note, start: note.start + bar4.start })),
      ],
      [
        ...bar1.tracks[1],
        ...bar2.tracks[1].map(note => ({ ...note, start: note.start + bar2.start })),
        ...bar3.tracks[1].map(note => ({ ...note, start: note.start + bar3.start })),
        ...bar4.tracks[1].map(note => ({ ...note, start: note.start + bar4.start })),
      ],
      [
        ...bar1.tracks[2],
        ...bar2.tracks[2].map(note => ({ ...note, start: note.start + bar2.start })),
        ...bar3.tracks[2].map(note => ({ ...note, start: note.start + bar3.start })),
        ...bar4.tracks[2].map(note => ({ ...note, start: note.start + bar4.start })),
      ],
    ],
  };

  return sheet;
};
