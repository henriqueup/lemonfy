/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createBar, fillBarTrack, findBarNoteByTime, setBarNotesTimesInSeconds, sumBarsCapacity } from "@entities/bar";
import * as NoteModule from "@entities/note";
import { createBarMock, getEmptyMockBar, getFilledMockBar } from "src/mocks/entities/bar";
import * as MockUtilsModule from "src/mocks/utils/moduleUtils";
import { SECONDS_PER_MINUTE } from "@entities/timeEvaluation";
import { createNoteMock } from "src/mocks/entities/note";

jest.mock<typeof NoteModule>("@entities/note", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>("src/mocks/utils/moduleUtils");
  return mockUtils.mockModuleFunctions(jest.requireActual("@entities/note"));
});

describe("Create Bar", () => {
  it("Creates Bar with initial values", () => {
    const newBar = createBar(3, 3, 4, 3 / 4, 80);

    expect(newBar.beatCount).toBe(3);
    expect(newBar.dibobinador).toBe(4);
    expect(newBar.capacity).toBe(3 / 4);
    expect(newBar.start).toBe(3 / 4);
    expect(newBar.tempo).toBe(80);
    expect(newBar.timeRatio).toBe(80 / SECONDS_PER_MINUTE);
    expect(newBar.trackCount).toBe(3);

    expect(newBar.tracks).toHaveLength(3);
    expect(newBar.tracks[0]).toHaveLength(0);
    expect(newBar.tracks[1]).toHaveLength(0);
    expect(newBar.tracks[2]).toHaveLength(0);

    expect(newBar.index).toBeUndefined();
  });
});

describe("Sum Bar capacity", () => {
  it("Sums empty Bar array capacity to 0", () => {
    const totalCapacity = sumBarsCapacity([]);

    expect(totalCapacity).toBe(0);
  });

  it("Sums Bar array capacity", () => {
    const bars = [
      createBarMock(3, 4, 4, 0, 60, 0), // capacity = 1
      createBarMock(3, 3, 4, 1, 60, 1), // capacity = 3 / 4
      createBarMock(3, 5, 4, 2, 60, 2), // capacity = 5 / 4
      createBarMock(3, 6, 8, 3, 60, 3), // capacity = 6 / 8
    ];

    const totalCapacity = sumBarsCapacity(bars);

    expect(totalCapacity).toBe(1 + 3 / 4 + 5 / 4 + 6 / 8);
  });
});

describe("Set Notes times in seconds", () => {
  // it("Fails with invalid Note at index", () => {
  //   const bar = getFilledMockBar();
  //   delete bar.tracks[1]![1];

  //   setBarNotesTimesInSeconds(bar);
  //   expect(() => setBarNotesTimesInSeconds(bar)).toThrowError("The note at index 3 should exist.");
  // });

  it("Sets times in seconds of all Notes", () => {
    const bar = getFilledMockBar();

    setBarNotesTimesInSeconds(bar);

    bar.tracks.forEach(track => {
      track.forEach(note => {
        expect(note.startInSeconds).toBe((note.start * bar.dibobinador) / bar.timeRatio);
        expect(note.durationInSeconds).toBe((note.duration * bar.dibobinador) / bar.timeRatio);
      });
    });
  });
});

describe("Fill track", () => {
  const noteModuleWithMocks = MockUtilsModule.getModuleWithMocks(NoteModule);

  beforeEach(() => {
    noteModuleWithMocks.createNote.mockImplementation(createNoteMock);
  });

  it("Does nothing with empty track", () => {
    const bar = getEmptyMockBar();
    const track: NoteModule.Note[] = [];

    fillBarTrack(bar, track, 0);

    expect(bar.tracks[0]).toHaveLength(0);
  });

  it("Does nothing with no Notes within Bar", () => {
    const bar = getEmptyMockBar();
    const track = [createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 3 / 4)];

    fillBarTrack(bar, track, 0);

    expect(bar.tracks[0]).toHaveLength(0);
  });

  // it("Fails with invalid first Note", () => {
  //   const bar = getEmptyMockBar();
  //   const track = [undefined, createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 0)] as NoteModule.Note[];

  //   expect(() => fillBarTrack(bar, track, 0)).toThrowError("Invalid first Note of track.");
  // });

  // it("Fails with invalid last Note", () => {
  //   const bar = getEmptyMockBar();
  //   const track = [createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 0), undefined] as NoteModule.Note[];

  //   expect(() => fillBarTrack(bar, track, 0)).toThrowError("Invalid last Note of track.");
  // });

  it("Fills with fitting Notes", () => {
    const bar = getEmptyMockBar();
    const track = [
      createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 1),
      createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 5 / 4),
      createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 6 / 4),
    ];

    fillBarTrack(bar, track, 0);

    expect(bar.tracks[0]).toHaveLength(3);

    const firstNote = bar.tracks[0]![0]!;
    expect(firstNote).not.toBe(track[0]);
    expect(firstNote.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
    expect(firstNote.start).toBe(0);
    expect(firstNote.hasSustain).toBe(false);
    expect(firstNote.isSustain).toBe(false);

    const secondNote = bar.tracks[0]![1]!;
    expect(secondNote.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
    expect(secondNote.start).toBe(1 / 4);
    expect(secondNote.hasSustain).toBe(false);
    expect(secondNote.isSustain).toBe(false);

    const thirdNote = bar.tracks[0]![2]!;
    expect(thirdNote.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
    expect(thirdNote.start).toBe(2 / 4);
    expect(thirdNote.hasSustain).toBe(false);
    expect(thirdNote.isSustain).toBe(false);
  });

  it("Fills with new Note objects", () => {
    const bar = getEmptyMockBar();
    const track = [
      createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 1),
      createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 5 / 4),
      createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 6 / 4),
    ];

    fillBarTrack(bar, track, 0);

    expect(bar.tracks[0]).toHaveLength(3);
    expect(bar.tracks[0]![0]!).not.toBe(track[0]);
    expect(bar.tracks[0]![1]!).not.toBe(track[1]);
    expect(bar.tracks[0]![2]!).not.toBe(track[2]);
  });

  it("Fills with empty spaces remaining", () => {
    const bar = getEmptyMockBar();
    const track = [
      createNoteMock(NoteModule.NOTE_DURATIONS["EIGHTH"], 10 / 8),
      createNoteMock(NoteModule.NOTE_DURATIONS["EIGHTH"], 12 / 8),
    ];

    fillBarTrack(bar, track, 0);

    expect(bar.tracks[0]).toHaveLength(2);

    const firstNote = bar.tracks[0]![0]!;
    expect(firstNote.duration).toBe(NoteModule.NOTE_DURATIONS["EIGHTH"]);
    expect(firstNote.start).toBe(2 / 8);
    expect(firstNote.hasSustain).toBe(false);
    expect(firstNote.isSustain).toBe(false);

    const sencondNote = bar.tracks[0]![1]!;
    expect(sencondNote.duration).toBe(NoteModule.NOTE_DURATIONS["EIGHTH"]);
    expect(sencondNote.start).toBe(4 / 8);
    expect(sencondNote.hasSustain).toBe(false);
    expect(sencondNote.isSustain).toBe(false);
  });

  it("Considers sustain on first Note", () => {
    const bar = getEmptyMockBar();
    const track = [createNoteMock(NoteModule.NOTE_DURATIONS["HALF"], 3 / 4)];

    fillBarTrack(bar, track, 0);

    expect(bar.tracks[0]).toHaveLength(1);

    const actualFirstNote = bar.tracks[0]![0]!;
    expect(actualFirstNote.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
    expect(actualFirstNote.start).toBe(0);
    expect(actualFirstNote.hasSustain).toBe(false);
    expect(actualFirstNote.isSustain).toBe(true);
  });

  it("Considers sustain on last Note", () => {
    const bar = getEmptyMockBar();
    const track = [
      createNoteMock(NoteModule.NOTE_DURATIONS["QUARTER"], 1),
      createNoteMock(NoteModule.NOTE_DURATIONS["HALF"], 6 / 4),
    ];

    fillBarTrack(bar, track, 0);

    expect(bar.tracks[0]).toHaveLength(2);

    const actualLastNote = bar.tracks[0]![1]!;
    expect(actualLastNote.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
    expect(actualLastNote.start).toBe(2 / 4);
    expect(actualLastNote.hasSustain).toBe(true);
    expect(actualLastNote.isSustain).toBe(false);
  });

  it("Considers sustain on single Note in whole Bar", () => {
    const bar = getEmptyMockBar();
    const track = [createNoteMock(NoteModule.NOTE_DURATIONS["DOUBLE_WHOLE"], 3 / 4)];

    fillBarTrack(bar, track, 0);

    expect(bar.tracks[0]).toHaveLength(1);

    const actualFirstNote = bar.tracks[0]![0]!;
    expect(actualFirstNote.duration).toBe(NoteModule.NOTE_DURATIONS["HALF"] + NoteModule.NOTE_DURATIONS["QUARTER"]);
    expect(actualFirstNote.start).toBe(0);
    expect(actualFirstNote.hasSustain).toBe(true);
    expect(actualFirstNote.isSustain).toBe(true);
  });
});

describe("Find Note by time", () => {
  it("Fails with invalid track index", () => {
    const bar = getFilledMockBar();

    expect(() => findBarNoteByTime(bar, 4, 1)).toThrowError("Invalid track index.");
  });

  it("Fails with invalid track", () => {
    const bar = getFilledMockBar();
    delete bar.tracks[1];

    expect(() => findBarNoteByTime(bar, 1, 1)).toThrowError("Invalid track at index: 1.");
  });

  it("Returns null when looking forward with end of Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 1 / 4);

    expect(result).toBeNull();
  });

  it("Returns null when looking backward with start of Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 2 / 4, false);

    expect(result).toBeNull();
  });

  it("Returns null in time without Notes when looking forward", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 3 / 8);

    expect(result).toBeNull();
  });

  it("Returns null in time without Notes when looking backward", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 3 / 8, false);

    expect(result).toBeNull();
  });

  it("Returns Note when looking forward with start of Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 2 / 4);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(2 / 4);
    expect(result!.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note when looking backward with end of Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 1 / 4, false);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(0);
    expect(result!.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note when looking forward within Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 5 / 8);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(2 / 4);
    expect(result!.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note when looking backward within Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 1 / 8, false);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(0);
    expect(result!.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note not containing time when looking forward", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 3 / 8, true, false);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(2 / 4);
    expect(result!.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note not containing time when looking backward", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(2, 1);
    const result = findBarNoteByTime(bar, 1, 5 / 8, false, false);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(1 / 4);
    expect(result!.duration).toBe(NoteModule.NOTE_DURATIONS["QUARTER"]);
  });
});
