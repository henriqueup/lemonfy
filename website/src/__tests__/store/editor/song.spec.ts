/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { INITIAL_STATE, useEditorStore } from "@/store/editor";
import {
  getEmptyMockSheet,
  getMockSheetWithBars,
} from "src/mocks/entities/sheet";
import * as SheetModule from "@entities/sheet";
import * as SongModule from "@entities/song";
import * as MockUtilsModule from "src/mocks/utils/moduleUtils";
import {
  addSheet,
  setSong,
  loadSong,
  saveSong,
} from "@/store/editor/songActions";
import { type Song } from "@entities/song";

jest.mock<typeof SongModule>("@entities/song", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>(
    "src/mocks/utils/moduleUtils",
  );
  const songModule = jest.requireActual<typeof SongModule>("@entities/song");
  return {
    ...songModule,
    __esModule: true,
    default: mockUtils.mockModuleFunctions(songModule.default),
  };
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

// initial state must be restored because of the mock used for immer
const preservedInitialState = structuredClone(INITIAL_STATE);
beforeEach(() => {
  useEditorStore.setState(structuredClone(preservedInitialState));
});

describe("Set Song", () => {
  it("Sets Song", () => {
    const song: Song = { name: "", artist: "", instruments: [] };
    songModuleWithMocks.createSong.mockImplementation(() => song);

    setSong("Test song", "Me");

    expect(songModuleWithMocks.createSong).toBeCalledTimes(1);
    expect(songModuleWithMocks.createSong).toBeCalledWith("Test song", "Me");

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song,
    });
  });
});

describe("Load Song", () => {
  it("Loads Song", () => {
    const sheet1 = getEmptyMockSheet();
    const sheet2 = getEmptyMockSheet();
    const song: Song = {
      name: "Test song",
      artist: "Me",
      instruments: [sheet1, sheet2],
    };

    loadSong(song);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song,
      currentSheetIndex: 0,
    });
  });
});

describe("Save Song", () => {
  it("Sets Song Id", () => {
    const song = { name: "test", artist: "me", sheets: [] };
    useEditorStore.setState(() => ({
      song,
    }));

    saveSong("clj03p3av00002a6ggmlryreg");

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song: {
        ...song,
        id: "clj03p3av00002a6ggmlryreg",
      },
    });
  });

  it("Clears isDirty", () => {
    const song = { name: "test", artist: "me", sheets: [] };
    useEditorStore.setState(() => ({
      song,
      isDirty: true,
    }));

    saveSong("clj03p3av00002a6ggmlryreg");

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song: {
        ...song,
        id: "clj03p3av00002a6ggmlryreg",
      },
    });
  });
});

describe("Add Sheet", () => {
  it("Does nothing with undefined Song", () => {
    addSheet(8);

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Adds first Sheet", () => {
    const sheet = getEmptyMockSheet();
    const song = { name: "", artist: "", sheets: [] };
    useEditorStore.setState(() => ({
      song,
    }));
    sheetModuleWithMocks.createSheet.mockImplementation(() => sheet);

    addSheet(8);

    expect(SheetModule.default.createSheet).toBeCalledTimes(1);
    expect(SheetModule.default.createSheet).toBeCalledWith(8);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song: { ...song, sheets: [sheet] },
      currentSheetIndex: 0,
    });
  });

  it("Adds Sheet with previous Sheets", () => {
    const initialSheet = getEmptyMockSheet();
    const sheet = getMockSheetWithBars();
    const song = { name: "", artist: "", sheets: [initialSheet] };
    useEditorStore.setState(() => ({
      song,
      currentSheet: initialSheet,
    }));
    sheetModuleWithMocks.createSheet.mockImplementation(() => sheet);

    addSheet(8);

    expect(SheetModule.default.createSheet).toBeCalledTimes(1);
    expect(SheetModule.default.createSheet).toBeCalledWith(8);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song: { ...song, sheets: [initialSheet, sheet] },
      currentSheetIndex: 1,
    });
  });
});
