/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { INITIAL_STATE, useEditorStore } from "@store/editor";
import { getEmptyMockSheet, getMockSheetWithBars } from "src/mocks/entities/sheet";
import * as SheetModule from "@entities/sheet";
import * as MockUtilsModule from "src/mocks/utils/moduleUtils";
import * as PitchModule from "@entities/pitch";
import * as NoteModule from "@entities/note";
import { createNoteMock } from "src/mocks/entities/note";
import { NOTE_DURATIONS } from "@entities/note";
import {
  addBar,
  addCopyOfCurrentBar,
  addNote,
  addSheet,
  loadSheet,
  removeBarFromSheetByIndex,
  removeNextNoteFromBar,
  removeNoteFromBar,
} from "@store/editor/sheetActions";
import { createBarMock } from "src/mocks/entities/bar";

jest.mock<typeof SheetModule.default>("@entities/sheet", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>("src/mocks/utils/moduleUtils");
  return mockUtils.mockModuleFunctions(jest.requireActual<typeof SheetModule>("@entities/sheet").default);
});
jest.mock<typeof NoteModule>("@entities/note", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>("src/mocks/utils/moduleUtils");
  return mockUtils.mockModuleFunctions(jest.requireActual("@entities/note"));
});
jest.mock<typeof PitchModule>("@entities/pitch", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>("src/mocks/utils/moduleUtils");
  return mockUtils.mockModuleFunctions(jest.requireActual("@entities/pitch"));
});

const sheetModuleWithMocks = MockUtilsModule.getModuleWithMocks(SheetModule.default);

describe("Load Sheet", () => {
  it("Loads Sheet", () => {
    const sheet = getEmptyMockSheet();

    loadSheet(sheet);

    expect(useEditorStore.getState().currentSheet).toBe(sheet);
  });
});

describe("Add Sheet", () => {
  it("Adds first Sheet", () => {
    const sheet = getEmptyMockSheet();
    sheetModuleWithMocks.createSheet.mockImplementation(() => sheet);

    addSheet(8);

    expect(SheetModule.default.createSheet).toBeCalledTimes(1);
    expect(SheetModule.default.createSheet).toBeCalledWith(8);

    expect(useEditorStore.getState().currentSheet).toBe(sheet);
    expect(useEditorStore.getState().sheets).toMatchObject([sheet]);
  });

  it("Adds Sheet with previous Sheets", () => {
    const initialSheet = getEmptyMockSheet();
    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      currentSheet: initialSheet,
      sheets: [initialSheet],
    }));
    sheetModuleWithMocks.createSheet.mockImplementation(() => sheet);

    addSheet(8);

    expect(SheetModule.default.createSheet).toBeCalledTimes(1);
    expect(SheetModule.default.createSheet).toBeCalledWith(8);

    expect(useEditorStore.getState().currentSheet).toBe(sheet);
    expect(useEditorStore.getState().sheets).toMatchObject([initialSheet, sheet]);
  });
});

describe("Add Bar", () => {
  it("Does nothing with undefined Sheet", () => {
    addBar(4, 4, 60);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Adds Bar to end of current Sheet", () => {
    const bar = createBarMock(3, 4, 4, 0, 60);
    sheetModuleWithMocks.addBarToSheet.mockImplementation((sheet: SheetModule.Sheet) => sheet.bars.push(bar));

    const sheet = getEmptyMockSheet();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));

    addBar(6, 8, 120);

    expect(SheetModule.default.addBarToSheet).toBeCalledTimes(1);
    expect(SheetModule.default.addBarToSheet).toBeCalledWith(sheet, 6, 8, 120);

    expect(useEditorStore.getState().currentSheet).toMatchObject({ ...sheet, bars: [bar] });
  });
});

describe("Add copy of current Bar", () => {
  it("Does nothing with undefined Sheet", () => {
    addCopyOfCurrentBar();

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with undefined current Bar", () => {
    const sheet = getEmptyMockSheet();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));

    addCopyOfCurrentBar();

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      currentSheet: sheet,
    });
  });

  it("Adds Bar after current Bar", () => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));

    addCopyOfCurrentBar();

    expect(SheetModule.default.addBarToSheet).toBeCalledTimes(1);
    expect(SheetModule.default.addBarToSheet).toBeCalledWith(sheet, 3, 4, 70, 0);
  });
});

describe("Add Note", () => {
  const noteModuleWithMocks = MockUtilsModule.getModuleWithMocks(NoteModule);
  const pitchModuleWithMocks = MockUtilsModule.getModuleWithMocks(PitchModule);

  it("Does nothing with undefined Sheet", () => {
    addNote(4, "B", 2);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with undefined Bar", () => {
    const sheet = getEmptyMockSheet();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));

    addNote(4, "B", 2);

    expect(useEditorStore.getState().currentSheet).toMatchObject(sheet);
    expect(useEditorStore.getState().cursor).toMatchObject(INITIAL_STATE.cursor);
  });

  it.each<[NoteModule.NoteDurationName, number]>([
    ["QUARTER", 1 / 4],
    ["LONG", 3 / 4],
  ])("Adds %p Note to first Bar", (durationName: NoteModule.NoteDurationName, expectedPosition: number) => {
    const pitch: PitchModule.Pitch = { name: "C", octave: 3, key: "C3", frequency: 88 };
    const note = createNoteMock(NOTE_DURATIONS[durationName], 8, pitch);
    pitchModuleWithMocks.createPitch.mockImplementation(() => pitch);
    noteModuleWithMocks.createNote.mockImplementation(() => note);

    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));

    sheetModuleWithMocks.addNoteToSheet.mockImplementation((sheet: SheetModule.Sheet) => sheet.tracks[0]!.push(note));
    sheetModuleWithMocks.fillBarTracksInSheet.mockImplementation((sheet: SheetModule.Sheet) =>
      sheet.bars[0]!.tracks[0]!.push(note),
    );

    addNote(4, "B", 2);

    expect(SheetModule.default.addNoteToSheet).toBeCalledTimes(1);
    expect(SheetModule.default.addNoteToSheet).toBeCalledWith(sheet, 0, note);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledTimes(1);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledWith(sheet, 0);

    expect(useEditorStore.getState().currentSheet).toMatchObject({
      ...sheet,
      tracks: [[note], [], []],
      bars: [{ ...sheet.bars[0], tracks: [[note], [], []] }, sheet.bars[1], sheet.bars[2]],
    });
    expect(useEditorStore.getState().cursor).toMatchObject({ ...INITIAL_STATE.cursor, position: expectedPosition });
  });

  it.each<[NoteModule.NoteDurationName, number]>([
    ["QUARTER", 1 / 4],
    ["LONG", 1],
  ])("Adds %p Note to second Bar", (durationName: NoteModule.NoteDurationName, expectedPosition: number) => {
    const pitch: PitchModule.Pitch = { name: "C", octave: 3, key: "C3", frequency: 88 };
    const note = createNoteMock(NOTE_DURATIONS[durationName], 8, pitch);
    pitchModuleWithMocks.createPitch.mockImplementation(() => pitch);
    noteModuleWithMocks.createNote.mockImplementation(() => note);

    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
      cursor: {
        ...INITIAL_STATE.cursor,
        barIndex: 1,
      },
    }));

    sheetModuleWithMocks.addNoteToSheet.mockImplementation((sheet: SheetModule.Sheet) => sheet.tracks[0]!.push(note));
    sheetModuleWithMocks.fillBarTracksInSheet.mockImplementation((sheet: SheetModule.Sheet) =>
      sheet.bars[1]!.tracks[0]!.push(note),
    );

    addNote(4, "B", 2);

    expect(SheetModule.default.addNoteToSheet).toBeCalledTimes(1);
    expect(SheetModule.default.addNoteToSheet).toBeCalledWith(sheet, 0, note);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledTimes(1);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledWith(sheet, 0);

    expect(useEditorStore.getState().currentSheet).toMatchObject({
      ...sheet,
      tracks: [[note], [], []],
      bars: [sheet.bars[0], { ...sheet.bars[1], tracks: [[note], [], []] }, sheet.bars[2]],
    });
    expect(useEditorStore.getState().cursor).toMatchObject({
      ...INITIAL_STATE.cursor,
      barIndex: 1,
      position: expectedPosition,
    });
  });
});

describe("Remove Note from Bar", () => {
  it("Does nothing with undefined Sheet", () => {
    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4);
    removeNoteFromBar(note);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Removes received Note", () => {
    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4);
    const sheet = getMockSheetWithBars();
    sheet.tracks[0]!.push(note);
    sheet.bars[0]!.tracks[0]!.push(note);

    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));

    sheetModuleWithMocks.removeNotesFromSheet.mockImplementation((sheet: SheetModule.Sheet) => sheet.tracks[0]!.pop());
    sheetModuleWithMocks.fillBarTracksInSheet.mockImplementation((sheet: SheetModule.Sheet) =>
      sheet.bars[0]!.tracks[0]!.pop(),
    );

    removeNoteFromBar(note);

    expect(SheetModule.default.removeNotesFromSheet).toBeCalledTimes(1);
    expect(SheetModule.default.removeNotesFromSheet).toBeCalledWith(sheet, 0, [note]);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledTimes(1);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledWith(sheet, 0);

    expect(useEditorStore.getState().currentSheet).toMatchObject(getMockSheetWithBars());
  });
});

describe("Remove next Note from Bar", () => {
  it.each([true, false])("Does nothing with undefined Sheet looking forward %p", (lookForward: boolean) => {
    removeNextNoteFromBar(lookForward);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it.each([true, false])("Does nothing with undefined Bar looking forward %p", (lookForward: boolean) => {
    const sheet = getEmptyMockSheet();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));
    removeNextNoteFromBar(lookForward);

    expect(useEditorStore.getState().currentSheet).toMatchObject(sheet);
  });

  it.each([true, false])("Does nothing with null Note looking forward %p", (lookForward: boolean) => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
      cursor: { ...INITIAL_STATE.cursor, trackIndex: 1, position: 1 / 4 },
    }));

    sheetModuleWithMocks.findSheetNoteByTime.mockImplementation(() => null);

    removeNextNoteFromBar(lookForward);

    expect(SheetModule.default.findSheetNoteByTime).toBeCalledTimes(1);
    expect(SheetModule.default.findSheetNoteByTime).toBeCalledWith(sheet, 1, 1 / 4, lookForward);

    expect(useEditorStore.getState().currentSheet).toMatchObject(sheet);
  });

  it.each([true, false])("Removes next Note looking forward %p", (lookForward: boolean) => {
    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4);
    const sheet = getMockSheetWithBars();
    sheet.tracks[1]!.push(note);
    sheet.bars[0]!.tracks[1]!.push(note);

    useEditorStore.setState(() => ({
      currentSheet: sheet,
      cursor: { ...INITIAL_STATE.cursor, trackIndex: 1, position: 2 / 4 },
    }));

    sheetModuleWithMocks.findSheetNoteByTime.mockImplementation(() => note);
    sheetModuleWithMocks.removeNotesFromSheet.mockImplementation((sheet: SheetModule.Sheet) => sheet.tracks[1]!.pop());
    sheetModuleWithMocks.fillBarTracksInSheet.mockImplementation((sheet: SheetModule.Sheet) =>
      sheet.bars[0]!.tracks[1]!.pop(),
    );

    removeNextNoteFromBar(lookForward);

    expect(SheetModule.default.findSheetNoteByTime).toBeCalledTimes(1);
    expect(SheetModule.default.findSheetNoteByTime).toBeCalledWith(sheet, 1, 2 / 4, lookForward);
    expect(SheetModule.default.removeNotesFromSheet).toBeCalledTimes(1);
    expect(SheetModule.default.removeNotesFromSheet).toBeCalledWith(sheet, 1, [note]);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledTimes(1);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledWith(sheet, 1);

    expect(useEditorStore.getState().currentSheet).toMatchObject(getMockSheetWithBars());
    expect(useEditorStore.getState().cursor).toMatchObject({
      ...INITIAL_STATE.cursor,
      trackIndex: 1,
      position: lookForward ? 2 / 4 : 1 / 4,
    });
  });

  it("Fails with no previous Bar", () => {
    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4);
    const sheet = getMockSheetWithBars();
    sheet.tracks[1]!.push(note);
    sheet.bars[0]!.tracks[1]!.push(note);

    useEditorStore.setState(() => ({
      currentSheet: sheet,
      cursor: { ...INITIAL_STATE.cursor, trackIndex: 1 },
    }));

    sheetModuleWithMocks.findSheetNoteByTime.mockImplementation(() => note);
    sheetModuleWithMocks.removeNotesFromSheet.mockImplementation((sheet: SheetModule.Sheet) => sheet.tracks[1]!.pop());
    sheetModuleWithMocks.fillBarTracksInSheet.mockImplementation((sheet: SheetModule.Sheet) =>
      sheet.bars[0]!.tracks[1]!.pop(),
    );

    expect(() => removeNextNoteFromBar(false)).toThrowError("There should be a previous bar.");

    expect(SheetModule.default.findSheetNoteByTime).toBeCalledTimes(1);
    expect(SheetModule.default.findSheetNoteByTime).toBeCalledWith(sheet, 1, 0, false);
    expect(SheetModule.default.removeNotesFromSheet).toBeCalledTimes(1);
    expect(SheetModule.default.removeNotesFromSheet).toBeCalledWith(sheet, 1, [note]);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledTimes(1);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledWith(sheet, 1);
  });

  it("Removes Note with cursor at 0 looking forward false", () => {
    const note = createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4);
    const sheet = getMockSheetWithBars();
    sheet.tracks[1]!.push(note);
    sheet.bars[0]!.tracks[1]!.push(note);

    useEditorStore.setState(() => ({
      currentSheet: sheet,
      cursor: { ...INITIAL_STATE.cursor, trackIndex: 1, barIndex: 1 },
    }));

    sheetModuleWithMocks.findSheetNoteByTime.mockImplementation(() => note);
    sheetModuleWithMocks.removeNotesFromSheet.mockImplementation((sheet: SheetModule.Sheet) => sheet.tracks[1]!.pop());
    sheetModuleWithMocks.fillBarTracksInSheet.mockImplementation((sheet: SheetModule.Sheet) =>
      sheet.bars[0]!.tracks[1]!.pop(),
    );

    removeNextNoteFromBar(false);

    expect(SheetModule.default.findSheetNoteByTime).toBeCalledTimes(1);
    expect(SheetModule.default.findSheetNoteByTime).toBeCalledWith(sheet, 1, 3 / 4, false);
    expect(SheetModule.default.removeNotesFromSheet).toBeCalledTimes(1);
    expect(SheetModule.default.removeNotesFromSheet).toBeCalledWith(sheet, 1, [note]);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledTimes(1);
    expect(SheetModule.default.fillBarTracksInSheet).toBeCalledWith(sheet, 1);

    expect(useEditorStore.getState().currentSheet).toMatchObject(getMockSheetWithBars());
    expect(useEditorStore.getState().cursor).toMatchObject({
      ...INITIAL_STATE.cursor,
      trackIndex: 1,
      position: 2 / 4,
    });
  });
});

describe("Remove Bar by index", () => {
  it("Does nothing with undefined Sheet", () => {
    removeBarFromSheetByIndex(1);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Removes received Bar", () => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));

    sheetModuleWithMocks.removeBarInSheetByIndex.mockImplementation((sheet: SheetModule.Sheet, barIndex: number) =>
      sheet.bars.splice(barIndex, 1),
    );

    removeBarFromSheetByIndex(1);

    expect(SheetModule.default.removeBarInSheetByIndex).toBeCalledTimes(1);
    expect(SheetModule.default.removeBarInSheetByIndex).toBeCalledWith(sheet, 1);

    expect(sheet.bars).toHaveLength(2);
    expect(useEditorStore.getState().currentSheet).toMatchObject(sheet);
  });
});
