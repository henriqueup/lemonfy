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
      sheets: [sheet1, sheet2],
    };

    loadSong(song);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song,
      currentSheetIndex: 0,
    });
  });
});

// describe("Set Song Id", () => {
//   it("Sets Song Id", () => {
//     useEditorStore.setState(() => ({
//       song: { name: "", artist: "", sheets: [] },
//     }));

//     setSongId("test-id");

//     expect(useEditorStore.getState().song!.id).toBe("test-id");
//   });
// });

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
