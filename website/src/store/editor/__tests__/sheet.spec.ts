/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { INITIAL_STATE, getCurrentSheet, useEditorStore } from "@/store/editor";
import {
  getEmptyMockSheet,
  getMockSheetWithBars,
} from "src/mocks/entities/sheet";
import {
  addBarToSheet,
  addNoteToSheet,
  fillBarTracksInSheet,
  findSheetNoteByTime,
  removeBarInSheetByIndex,
  removeNotesFromSheet,
  type Sheet,
} from "@entities/sheet";
import { createPitch, type Pitch } from "@entities/pitch";
import { createNote, type NoteDurationName } from "@entities/note";
import { createNoteMock } from "src/mocks/entities/note";
import { NOTE_DURATIONS } from "@entities/note";
import {
  addBar,
  addCopyOfCurrentBar,
  addNote,
  addNoteByFret,
  removeBarFromSheetByIndex,
  removeNextNoteFromBar,
  removeNoteFromBar,
} from "@/store/editor/sheetActions";
import { createBarMock } from "src/mocks/entities/bar";
import { getMockSong } from "@/mocks/entities/song";
import { addNoteToFrettedInstrument } from "@/server/entities/instrument";

jest.mock("@/utils/immer");
jest.mock("@entities/sheet");
jest.mock("@entities/note");
jest.mock("@entities/pitch");
jest.mock("@entities/instrument");

// initial state must be restored because of the mock used for immer
const preservedInitialState = structuredClone(INITIAL_STATE);
beforeEach(() => {
  useEditorStore.setState(structuredClone(preservedInitialState));
});

describe("Add Bar", () => {
  it("Does nothing with undefined Song", () => {
    addBar(4, 4, 60);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with undefined Sheet index", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
    }));

    addBar(4, 4, 60);

    expect(useEditorStore.getState()).toMatchObject({ ...INITIAL_STATE, song });
  });

  it("Adds Bar to end of current Sheet", () => {
    const bar = createBarMock(3, 4, 4, 0, 60);
    (addBarToSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
      sheet.bars.push(bar),
    );

    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
    }));

    addBar(6, 8, 120);

    expect(addBarToSheet).toBeCalledTimes(1);
    expect(addBarToSheet).toBeCalledWith(sheet, 6, 8, 120);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song,
      currentInstrumentIndex: 0,
    });
  });
});

describe("Add copy of current Bar", () => {
  it("Does nothing with undefined Song", () => {
    addCopyOfCurrentBar();

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with undefined Sheet index", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
    }));

    addCopyOfCurrentBar();

    expect(useEditorStore.getState()).toMatchObject({ ...INITIAL_STATE, song });
  });

  it("Does nothing with undefined current Bar", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
    }));

    addCopyOfCurrentBar();

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song,
      currentInstrumentIndex: 0,
    });
  });

  it("Adds Bar after current Bar", () => {
    const sheet = getMockSheetWithBars();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
    }));

    addCopyOfCurrentBar();

    expect(addBarToSheet).toBeCalledTimes(1);
    expect(addBarToSheet).toBeCalledWith(sheet, 3, 4, 70, 0);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song,
      currentInstrumentIndex: 0,
    });
  });
});

describe("Add Note", () => {
  it("Does nothing with undefined Song", () => {
    addNote("B");

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with undefined Sheet index", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
    }));

    addNote("B");

    expect(useEditorStore.getState()).toMatchObject({ ...INITIAL_STATE, song });
  });

  it("Does nothing with undefined Bar", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
    }));

    addNote("B");

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song,
      currentInstrumentIndex: 0,
    });
  });

  it.each<[NoteDurationName, number]>([
    ["QUARTER", 1 / 4],
    ["LONG", 3 / 4],
  ])(
    "Adds %p Note to first Bar",
    (durationName: NoteDurationName, expectedPosition: number) => {
      const pitch: Pitch = {
        name: "C",
        octave: 3,
        key: "C3",
        frequency: 88,
      };
      const note = createNoteMock(NOTE_DURATIONS[durationName], 8, pitch);
      (createPitch as jest.Mock).mockImplementation(() => pitch);
      (createNote as jest.Mock).mockImplementation(() => note);

      const sheet = getMockSheetWithBars();
      const song = getMockSong([sheet]);
      useEditorStore.setState(() => ({
        song,
        currentInstrumentIndex: 0,
        selectedOctave: 2,
      }));

      (addNoteToSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
        sheet.tracks[0]!.push(note),
      );
      (fillBarTracksInSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
        sheet.bars[0]!.tracks[0]!.push(note),
      );

      addNote("B");

      expect(addNoteToSheet).toBeCalledTimes(1);
      expect(addNoteToSheet).toBeCalledWith(sheet, 0, note);
      expect(fillBarTracksInSheet).toBeCalledTimes(1);
      expect(fillBarTracksInSheet).toBeCalledWith(sheet, 0);

      expect(getCurrentSheet()).toMatchObject({
        tracks: [[note], [], []],
        bars: [
          { ...sheet.bars[0], tracks: [[note], [], []] },
          sheet.bars[1],
          sheet.bars[2],
        ],
      });

      expect(useEditorStore.getState()).toMatchObject({
        ...INITIAL_STATE,
        isDirty: true,
        song,
        currentInstrumentIndex: 0,
        cursor: {
          ...INITIAL_STATE.cursor,
          position: expectedPosition,
        },
        selectedOctave: 2,
      });
    },
  );

  it.each<[NoteDurationName, number]>([
    ["QUARTER", 1 / 4],
    ["LONG", 1],
  ])(
    "Adds %p Note to second Bar",
    (durationName: NoteDurationName, expectedPosition: number) => {
      const pitch: Pitch = {
        name: "C",
        octave: 3,
        key: "C3",
        frequency: 88,
      };
      const note = createNoteMock(NOTE_DURATIONS[durationName], 8, pitch);
      (createPitch as jest.Mock).mockImplementation(() => pitch);
      (createNote as jest.Mock).mockImplementation(() => note);

      const sheet = getMockSheetWithBars();
      const song = getMockSong([sheet]);
      useEditorStore.setState(() => ({
        song,
        currentInstrumentIndex: 0,
        cursor: {
          ...INITIAL_STATE.cursor,
          barIndex: 1,
        },
        selectedOctave: 2,
      }));

      (addNoteToSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
        sheet.tracks[0]!.push(note),
      );
      (fillBarTracksInSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
        sheet.bars[1]!.tracks[0]!.push(note),
      );

      addNote("B");

      expect(addNoteToSheet).toBeCalledTimes(1);
      expect(addNoteToSheet).toBeCalledWith(sheet, 0, note);
      expect(fillBarTracksInSheet).toBeCalledTimes(1);
      expect(fillBarTracksInSheet).toBeCalledWith(sheet, 0);

      expect(getCurrentSheet()).toMatchObject({
        tracks: [[note], [], []],
        bars: [
          sheet.bars[0],
          { ...sheet.bars[1], tracks: [[note], [], []] },
          sheet.bars[2],
        ],
      });

      expect(useEditorStore.getState()).toMatchObject({
        ...INITIAL_STATE,
        isDirty: true,
        song,
        currentInstrumentIndex: 0,
        cursor: {
          ...INITIAL_STATE.cursor,
          barIndex: 1,
          position: expectedPosition,
        },
        selectedOctave: 2,
      });
    },
  );
});

describe("Add Note by fret", () => {
  it("Does nothing with undefined Song", () => {
    addNoteByFret(4);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with undefined Instrument index", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
    }));

    addNoteByFret(4);

    expect(useEditorStore.getState()).toMatchObject({ ...INITIAL_STATE, song });
  });

  it("Does nothing with undefined Instrument", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 4,
    }));

    addNoteByFret(4);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song,
      currentInstrumentIndex: 4,
    });
  });

  it("Does nothing with undefined Sheet", () => {
    const song = getMockSong([]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
    }));

    addNoteByFret(4);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song,
      currentInstrumentIndex: 0,
    });
  });

  it("Does nothing with undefined Bar", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
    }));

    addNoteByFret(4);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song,
      currentInstrumentIndex: 0,
    });
  });

  it("Adds Note to Instrument", () => {
    const sheet = getMockSheetWithBars();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
      cursor: {
        barIndex: 1,
        trackIndex: 2,
        position: 1 / 4,
      },
      selectedNoteDuration: "HALF",
    }));

    addNoteByFret(4);

    expect(addNoteToFrettedInstrument).toHaveBeenCalledTimes(1);
    expect(addNoteToFrettedInstrument).toHaveBeenCalledWith(
      song.instruments[0],
      2,
      4,
      NOTE_DURATIONS["HALF"],
      3 / 4 + 1 / 4,
    );
    expect(fillBarTracksInSheet).toBeCalledTimes(1);
    expect(fillBarTracksInSheet).toBeCalledWith(sheet, 2);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song,
      currentInstrumentIndex: 0,
      cursor: {
        barIndex: 1,
        trackIndex: 2,
        position: 1 / 4 + 1 / 2,
      },
      selectedNoteDuration: "HALF",
    });
  });
});

describe("Remove Note from Bar", () => {
  it("Does nothing with undefined Song", () => {
    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4);
    removeNoteFromBar(note);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with undefined Instrument index", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
    }));

    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4);
    removeNoteFromBar(note);

    expect(useEditorStore.getState()).toMatchObject({ ...INITIAL_STATE, song });
  });

  it("Removes received Note", () => {
    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4);
    const sheet = getMockSheetWithBars();
    sheet.tracks[0]!.push(note);
    sheet.bars[0]!.tracks[0]!.push(note);

    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
    }));

    (removeNotesFromSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
      sheet.tracks[0]!.pop(),
    );
    (fillBarTracksInSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
      sheet.bars[0]!.tracks[0]!.pop(),
    );

    removeNoteFromBar(note);

    expect(removeNotesFromSheet).toBeCalledTimes(1);
    expect(removeNotesFromSheet).toBeCalledWith(sheet, 0, [note]);
    expect(fillBarTracksInSheet).toBeCalledTimes(1);
    expect(fillBarTracksInSheet).toBeCalledWith(sheet, 0);

    expect(getCurrentSheet()).toMatchObject(getMockSheetWithBars());
    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song,
      currentInstrumentIndex: 0,
    });
  });
});

describe("Remove next Note from Bar", () => {
  it.each([true, false])(
    "Does nothing with undefined Song looking forward %p",
    (lookForward: boolean) => {
      removeNextNoteFromBar(lookForward);

      expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
    },
  );

  it.each([true, false])(
    "Does nothing with undefined Instrument index looking forward %p",
    (lookForward: boolean) => {
      const sheet = getEmptyMockSheet();
      const song = getMockSong([sheet]);
      useEditorStore.setState(() => ({
        song,
      }));

      removeNextNoteFromBar(lookForward);

      expect(useEditorStore.getState()).toMatchObject({
        ...INITIAL_STATE,
        song,
      });
    },
  );

  it.each([true, false])(
    "Does nothing with undefined Bar looking forward %p",
    (lookForward: boolean) => {
      const sheet = getEmptyMockSheet();
      const song = getMockSong([sheet]);
      useEditorStore.setState(() => ({
        song,
        currentInstrumentIndex: 0,
      }));
      removeNextNoteFromBar(lookForward);

      expect(getCurrentSheet()).toMatchObject(sheet);
    },
  );

  it.each([true, false])(
    "Does nothing with null Note looking forward %p",
    (lookForward: boolean) => {
      const sheet = getMockSheetWithBars();
      const song = getMockSong([sheet]);
      useEditorStore.setState(() => ({
        song,
        currentInstrumentIndex: 0,
        cursor: { ...INITIAL_STATE.cursor, trackIndex: 1, position: 1 / 4 },
      }));

      (findSheetNoteByTime as jest.Mock).mockImplementation(() => null);

      removeNextNoteFromBar(lookForward);

      expect(findSheetNoteByTime).toBeCalledTimes(1);
      expect(findSheetNoteByTime).toBeCalledWith(sheet, 1, 1 / 4, lookForward);

      expect(getCurrentSheet()).toMatchObject(sheet);
    },
  );

  it.each([true, false])(
    "Removes next Note looking forward %p",
    (lookForward: boolean) => {
      const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4);
      const sheet = getMockSheetWithBars();
      sheet.tracks[1]!.push(note);
      sheet.bars[0]!.tracks[1]!.push(note);

      const song = getMockSong([sheet]);
      useEditorStore.setState(() => ({
        song,
        currentInstrumentIndex: 0,
        cursor: { ...INITIAL_STATE.cursor, trackIndex: 1, position: 2 / 4 },
      }));

      (findSheetNoteByTime as jest.Mock).mockImplementation(() => note);
      (removeNotesFromSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
        sheet.tracks[1]!.pop(),
      );
      (fillBarTracksInSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
        sheet.bars[0]!.tracks[1]!.pop(),
      );

      removeNextNoteFromBar(lookForward);

      expect(findSheetNoteByTime).toBeCalledTimes(1);
      expect(findSheetNoteByTime).toBeCalledWith(sheet, 1, 2 / 4, lookForward);
      expect(removeNotesFromSheet).toBeCalledTimes(1);
      expect(removeNotesFromSheet).toBeCalledWith(sheet, 1, [note]);
      expect(fillBarTracksInSheet).toBeCalledTimes(1);
      expect(fillBarTracksInSheet).toBeCalledWith(sheet, 1);

      expect(getCurrentSheet()).toMatchObject(getMockSheetWithBars());
      expect(useEditorStore.getState()).toMatchObject({
        ...INITIAL_STATE,
        isDirty: true,
        song,
        currentInstrumentIndex: 0,
        cursor: {
          ...INITIAL_STATE.cursor,
          trackIndex: 1,
          position: lookForward ? 2 / 4 : 1 / 4,
        },
      });
    },
  );

  it("Fails with no previous Bar", () => {
    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4);
    const sheet = getMockSheetWithBars();
    sheet.tracks[1]!.push(note);
    sheet.bars[0]!.tracks[1]!.push(note);

    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
      cursor: { ...INITIAL_STATE.cursor, trackIndex: 1 },
    }));

    (findSheetNoteByTime as jest.Mock).mockImplementation(() => note);
    (removeNotesFromSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
      sheet.tracks[1]!.pop(),
    );
    (fillBarTracksInSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
      sheet.bars[0]!.tracks[1]!.pop(),
    );

    expect(() => removeNextNoteFromBar(false)).toThrowError(
      "There should be a previous bar.",
    );

    expect(findSheetNoteByTime).toBeCalledTimes(1);
    expect(findSheetNoteByTime).toBeCalledWith(sheet, 1, 0, false);
    expect(removeNotesFromSheet).toBeCalledTimes(1);
    expect(removeNotesFromSheet).toBeCalledWith(sheet, 1, [note]);
    expect(fillBarTracksInSheet).toBeCalledTimes(1);
    expect(fillBarTracksInSheet).toBeCalledWith(sheet, 1);
  });

  it("Removes Note with cursor at 0 looking forward false", () => {
    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4);
    const sheet = getMockSheetWithBars();
    sheet.tracks[1]!.push(note);
    sheet.bars[0]!.tracks[1]!.push(note);

    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
      cursor: { ...INITIAL_STATE.cursor, trackIndex: 1, barIndex: 1 },
    }));

    (findSheetNoteByTime as jest.Mock).mockImplementation(() => note);
    (removeNotesFromSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
      sheet.tracks[1]!.pop(),
    );
    (fillBarTracksInSheet as jest.Mock).mockImplementation((sheet: Sheet) =>
      sheet.bars[0]!.tracks[1]!.pop(),
    );

    removeNextNoteFromBar(false);

    expect(findSheetNoteByTime).toBeCalledTimes(1);
    expect(findSheetNoteByTime).toBeCalledWith(sheet, 1, 3 / 4, false);
    expect(removeNotesFromSheet).toBeCalledTimes(1);
    expect(removeNotesFromSheet).toBeCalledWith(sheet, 1, [note]);
    expect(fillBarTracksInSheet).toBeCalledTimes(1);
    expect(fillBarTracksInSheet).toBeCalledWith(sheet, 1);

    expect(getCurrentSheet()).toMatchObject(getMockSheetWithBars());
    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song,
      currentInstrumentIndex: 0,
      cursor: {
        ...INITIAL_STATE.cursor,
        trackIndex: 1,
        position: 2 / 4,
      },
    });
  });
});

describe("Remove Bar by index", () => {
  it("Does nothing with undefined Song", () => {
    removeBarFromSheetByIndex(1);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with undefined Sheet index", () => {
    const sheet = getEmptyMockSheet();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
    }));

    removeBarFromSheetByIndex(1);

    expect(useEditorStore.getState()).toMatchObject({ ...INITIAL_STATE, song });
  });

  it("Removes received Bar", () => {
    const sheet = getMockSheetWithBars();
    const song = getMockSong([sheet]);
    useEditorStore.setState(() => ({
      song,
      currentInstrumentIndex: 0,
    }));

    (removeBarInSheetByIndex as jest.Mock).mockImplementation(
      (sheet: Sheet, barIndex: number) => sheet.bars.splice(barIndex, 1),
    );

    removeBarFromSheetByIndex(1);

    expect(removeBarInSheetByIndex).toBeCalledTimes(1);
    expect(removeBarInSheetByIndex).toBeCalledWith(sheet, 1);

    expect(sheet.bars).toHaveLength(2);
    expect(getCurrentSheet()).toMatchObject(sheet);
    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song,
      currentInstrumentIndex: 0,
    });
  });
});
