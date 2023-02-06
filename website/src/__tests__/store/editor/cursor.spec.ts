import { type Cursor, INITIAL_STATE, useEditorStore } from "@store/editor";
import {
  decreaseCursorBarIndex,
  decreaseCursorTrackIndex,
  increaseCursorBarIndex,
  increaseCursorTrackIndex,
} from "@store/editor/cursorActions";
import { getEmptyMockSheet, getMockSheetWithBars } from "src/mocks/entities/sheet";

describe("Increase track index", () => {
  it("Does nothing with undefined sheet", () => {
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
  it("Does nothing with undefined sheet", () => {
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
  it("Does nothing with undefined sheet", () => {
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

  it("Increases the Bar index", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 1 },
    }));
    increaseCursorBarIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, barIndex: 2 });
  });
});

describe("Decrease Bar index", () => {
  it("Does nothing with undefined sheet", () => {
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

  it("Decreases the Bar index", () => {
    useEditorStore.setState(state => ({
      currentSheet: getMockSheetWithBars(),
      cursor: { ...state.cursor, barIndex: 1 },
    }));
    decreaseCursorBarIndex();

    expect(useEditorStore.getState().cursor).toStrictEqual<Cursor>({ ...INITIAL_STATE.cursor, barIndex: 0 });
  });
});
