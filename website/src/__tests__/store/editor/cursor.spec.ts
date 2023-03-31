import { type Cursor, INITIAL_STATE, useEditorStore } from "@store/editor";
import {
  decreaseCursorBarIndex,
  decreaseCursorPosition,
  decreaseCursorTrackIndex,
  increaseCursorBarIndex,
  increaseCursorPosition,
  increaseCursorTrackIndex,
  moveCursorToEndOfBar,
  moveCursorToStartOfBar,
} from "@store/editor/cursorActions";
import { getEmptyMockSheet, getMockSheetWithBars, getMockSheetWithGap } from "src/mocks/entities/sheet";
import * as BarModule from "@entities/bar";
import * as MockUtilsModule from "src/mocks/utils/moduleUtils";
import { createNoteMock } from "src/mocks/entities/note";
import { NOTE_DURATIONS } from "@entities/note";

jest.mock<typeof BarModule.default>("@entities/bar", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>("src/mocks/utils/moduleUtils");
  return mockUtils.mockModuleFunctions(jest.requireActual<typeof BarModule>("@entities/bar").default);
});
const barModuleWithMocks = MockUtilsModule.getModuleWithMocks(BarModule.default);

describe("Increase track index", () => {
  it("Does nothing with undefined Sheet", () => {
    increaseCursorTrackIndex();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Does nothing when index already maxed", () => {
    useEditorStore.setState(state => ({
      currentSheet: getEmptyMockSheet(),
      cursor: { ...state.cursor, trackIndex: 2 },
    }));
    increaseCursorTrackIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, trackIndex: 2 });
  });

  it("Increases the track index", () => {
    useEditorStore.setState(state => ({
      currentSheet: getEmptyMockSheet(),
      cursor: { ...state.cursor, trackIndex: 1 },
    }));
    increaseCursorTrackIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, trackIndex: 2 });
  });
});

describe("Decrease track index", () => {
  it("Does nothing with undefined Sheet", () => {
    decreaseCursorTrackIndex();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Does nothing when index is 0", () => {
    useEditorStore.setState(() => ({
      currentSheet: getEmptyMockSheet(),
    }));
    decreaseCursorTrackIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor });
  });

  it("Decreases the track index", () => {
    useEditorStore.setState(state => ({
      currentSheet: getEmptyMockSheet(),
      cursor: { ...state.cursor, trackIndex: 1 },
    }));
    decreaseCursorTrackIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, trackIndex: 0 });
  });
});

describe("Increase Bar index", () => {
  it("Does nothing with undefined Sheet", () => {
    increaseCursorBarIndex();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Does nothing when index already maxed", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 2 },
    }));
    increaseCursorBarIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, barIndex: 2 });
  });

  it("Increases the Bar index and sets position to 0", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 1, position: 1 },
    }));
    increaseCursorBarIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, barIndex: 2 });
  });
});

describe("Decrease Bar index", () => {
  it("Does nothing with undefined Sheet", () => {
    decreaseCursorBarIndex();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Does nothing when index is 0", () => {
    useEditorStore.setState(() => ({
      currentSheet: getMockSheetWithBars(),
    }));
    decreaseCursorBarIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor });
  });

  it("Decreases the Bar index and sets position to 0", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 1, position: 1 },
    }));
    decreaseCursorBarIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, barIndex: 0 });
  });
});

describe("Increase cursor position", () => {
  it("Does nothing with undefined Sheet", () => {
    increaseCursorPosition();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Does nothing with undefined Bar", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 4 },
    }));
    increaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, barIndex: 4 });
  });

  it("Does nothing when position is end of Bar", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, position: 3 / 4 },
    }));
    increaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, position: 3 / 4 });
  });

  it("Increases position without next Note and no Note within selected duration", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, position: 1 / 4 },
      selectedNoteDuration: "HALF",
    }));
    increaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, position: 3 / 4 });
  });

  it("Increases position with resulting position larger than Bar", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, position: 1 / 4 },
      selectedNoteDuration: "WHOLE",
    }));
    increaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, position: 3 / 4 });
  });

  it("Increases position without next Note but with Note within selected duration", () => {
    barModuleWithMocks.findBarNoteByTime.mockImplementation(() => createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4));
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, trackIndex: 1, position: 1 / 4 },
      selectedNoteDuration: "HALF",
    }));
    increaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({
      ...INITIAL_STATE.cursor,
      trackIndex: 1,
      position: 2 / 4,
    });
  });

  it("Increases position with next Note smaller than selected duration", () => {
    barModuleWithMocks.findBarNoteByTime.mockImplementation(() => createNoteMock(NOTE_DURATIONS["QUARTER"], 0));
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, trackIndex: 1 },
      selectedNoteDuration: "HALF",
    }));

    increaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({
      ...INITIAL_STATE.cursor,
      trackIndex: 1,
      position: 1 / 4,
    });
  });

  it("Increases position with next Note longer than selected duration", () => {
    barModuleWithMocks.findBarNoteByTime.mockImplementation(() => createNoteMock(NOTE_DURATIONS["QUARTER"], 0));
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, trackIndex: 1 },
      selectedNoteDuration: "EIGHTH",
    }));

    increaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({
      ...INITIAL_STATE.cursor,
      trackIndex: 1,
      position: 1 / 4,
    });
  });
});

describe("Decrease cursor position", () => {
  beforeEach(() => {
    MockUtilsModule.restoreMocks(barModuleWithMocks);
  });

  it("Does nothing with undefined Sheet", () => {
    decreaseCursorPosition();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Does nothing with undefined Bar", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 4 },
    }));
    decreaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, barIndex: 4 });
  });

  it("Does nothing when position is start of Bar", () => {
    useEditorStore.setState(() => ({
      currentSheet: getMockSheetWithBars(),
    }));
    decreaseCursorPosition();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Decreases position without previous Note and no Note within selected duration", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, position: 3 / 4 },
      selectedNoteDuration: "HALF",
    }));
    decreaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, position: 1 / 4 });
  });

  it("Decreases position with resulting position smaller than 0", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, position: 3 / 4 },
      selectedNoteDuration: "WHOLE",
    }));
    decreaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor });
  });

  it("Decreases position without previous Note but with Note within selected duration", () => {
    barModuleWithMocks.findBarNoteByTime.mockImplementation(() => createNoteMock(NOTE_DURATIONS["QUARTER"], 0));
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, trackIndex: 1, position: 2 / 4 },
      selectedNoteDuration: "HALF",
    }));
    decreaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({
      ...INITIAL_STATE.cursor,
      trackIndex: 1,
      position: 1 / 4,
    });
  });

  it("Decreases position with previous Note smaller than selected duration", () => {
    barModuleWithMocks.findBarNoteByTime.mockImplementation(() => createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4));
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, trackIndex: 1, position: 3 / 4 },
      selectedNoteDuration: "HALF",
    }));

    decreaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({
      ...INITIAL_STATE.cursor,
      trackIndex: 1,
      position: 2 / 4,
    });
  });

  it("Decreases position with previous Note longer than selected duration", () => {
    barModuleWithMocks.findBarNoteByTime.mockImplementation(() => createNoteMock(NOTE_DURATIONS["QUARTER"], 2 / 4));
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithGap(),
      cursor: { ...state.cursor, trackIndex: 1, position: 3 / 4 },
      selectedNoteDuration: "EIGHTH",
    }));

    decreaseCursorPosition();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({
      ...INITIAL_STATE.cursor,
      trackIndex: 1,
      position: 2 / 4,
    });
  });
});

describe("Move cursor to end of Bar", () => {
  it("Does nothing with undefined Sheet", () => {
    moveCursorToEndOfBar();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Does nothing with undefined Bar", () => {
    useEditorStore.setState(() => ({
      currentSheet: getEmptyMockSheet(),
    }));
    moveCursorToEndOfBar();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Moves cursor from 0 to end of Bar", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 1 },
    }));
    moveCursorToEndOfBar();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({
      ...INITIAL_STATE.cursor,
      barIndex: 1,
      position: 1,
    });
  });

  it("Moves cursor from middle to end of Bar", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 1, position: 1 / 4 },
    }));
    moveCursorToEndOfBar();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({
      ...INITIAL_STATE.cursor,
      barIndex: 1,
      position: 1,
    });
  });
});

describe("Move cursor to start of Bar", () => {
  it("Does nothing with undefined Sheet", () => {
    moveCursorToStartOfBar();

    expect(useEditorStore.getState().cursor).toBe(INITIAL_STATE.cursor);
  });

  it("Moves cursor to start of Bar", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 1, position: 1 / 4 },
    }));
    moveCursorToStartOfBar();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({
      ...INITIAL_STATE.cursor,
      barIndex: 1,
    });
  });
});
