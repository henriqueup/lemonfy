/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { INITIAL_STATE, useEditorStore } from "@/store/editor";
import {
  getEmptyMockSheet,
  getMockSheetWithBars,
} from "src/mocks/entities/sheet";
import * as SheetModule from "@entities/sheet";
import * as SongModule from "@entities/song";
import * as MockUtilsModule from "src/mocks/utils/moduleUtils";
import { addSheet, setSong, loadSong } from "@/store/editor/songActions";
import { type Song } from "@entities/song";

jest.mock<typeof SongModule.default>("@entities/song", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>(
    "src/mocks/utils/moduleUtils",
  );
  return mockUtils.mockModuleFunctions(
    jest.requireActual<typeof SongModule>("@entities/song").default,
  );
});
jest.mock<typeof SheetModule.default>("@entities/sheet", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>(
    "src/mocks/utils/moduleUtils",
  );
  return mockUtils.mockModuleFunctions(
    jest.requireActual<typeof SheetModule>("@entities/sheet").default,
  );
});

const songModuleWithMocks = MockUtilsModule.getModuleWithMocks(
  SongModule.default,
);
const sheetModuleWithMocks = MockUtilsModule.getModuleWithMocks(
  SheetModule.default,
);

describe("Add Song", () => {
  it("Adds Song", () => {
    const song: Song = { name: "", artist: "", sheets: [] };
    songModuleWithMocks.createSong.mockImplementation(() => song);

    setSong("Test song", "Me");

    expect(songModuleWithMocks.createSong).toBeCalledTimes(1);
    expect(songModuleWithMocks.createSong).toBeCalledWith("Test song", "Me");

    expect(useEditorStore.getState().song).toMatchObject(song);
  });
});

describe("Load Song", () => {
  it("Loads Song", () => {
    const sheet1 = getEmptyMockSheet();
    const sheet2 = getEmptyMockSheet();
    const song: Song = {
      name: "Test song",
      artist: "Me",
      sheets: [sheet1, sheet2],
    };

    loadSong(song);

    expect(useEditorStore.getState().song).toBe(song);
    expect(useEditorStore.getState().currentSheetIndex).toBe(0);
  });
});

describe("Add Sheet", () => {
  it("Does nothing with undefined Song", () => {
    addSheet(8);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Adds first Sheet", () => {
    const sheet = getEmptyMockSheet();
    useEditorStore.setState(() => ({
      song: { name: "", artist: "", sheets: [] },
    }));
    sheetModuleWithMocks.createSheet.mockImplementation(() => sheet);

    addSheet(8);

    expect(SheetModule.default.createSheet).toBeCalledTimes(1);
    expect(SheetModule.default.createSheet).toBeCalledWith(8);

    expect(useEditorStore.getState().currentSheetIndex).toBe(0);
    expect(useEditorStore.getState().song).toMatchObject({ sheets: [sheet] });
  });

  it("Adds Sheet with previous Sheets", () => {
    const initialSheet = getEmptyMockSheet();
    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      song: { name: "", artist: "", sheets: [initialSheet] },
      currentSheet: initialSheet,
    }));
    sheetModuleWithMocks.createSheet.mockImplementation(() => sheet);

    addSheet(8);

    expect(SheetModule.default.createSheet).toBeCalledTimes(1);
    expect(SheetModule.default.createSheet).toBeCalledWith(8);

    expect(useEditorStore.getState().currentSheetIndex).toBe(1);
    expect(useEditorStore.getState().song).toMatchObject({
      sheets: [initialSheet, sheet],
    });
  });
});
