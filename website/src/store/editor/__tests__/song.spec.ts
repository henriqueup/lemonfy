/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { INITIAL_STATE, useEditorStore } from "@/store/editor";
import {
  getEmptyMockSheet,
  getMockSheetWithBars,
} from "src/mocks/entities/sheet";
import { createSheet } from "@entities/sheet";
import { createSong } from "@entities/song";
import {
  addInstrument,
  setSong,
  loadSong,
  saveSong,
  setCurrentInstrumentIndex,
} from "@/store/editor/songActions";
import { type Song } from "@entities/song";
import { getMockInstrument } from "@/mocks/entities/instrument";

jest.mock("@entities/song");
jest.mock("@entities/sheet");

// initial state must be restored because of the mock used for immer
const preservedInitialState = structuredClone(INITIAL_STATE);
beforeEach(() => {
  useEditorStore.setState(structuredClone(preservedInitialState));
});

describe("Set Song", () => {
  it("Sets Song", () => {
    const song: Song = { name: "", artist: "", instruments: [] };
    (createSong as jest.Mock).mockImplementation(() => song);

    setSong("Test song", "Me");

    expect(createSong).toBeCalledTimes(1);
    expect(createSong).toBeCalledWith("Test song", "Me");

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
      instruments: [getMockInstrument(sheet1), getMockInstrument(sheet2)],
    };

    loadSong(song);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      song,
      currentInstrumentIndex: 0,
    });
  });
});

describe("Save Song", () => {
  it("Sets Song Id", () => {
    const song: Song = { name: "test", artist: "me", instruments: [] };
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
    const song: Song = { name: "test", artist: "me", instruments: [] };
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

describe("Add Instrument", () => {
  it("Does nothing with undefined Song", () => {
    addInstrument(getMockInstrument());

    expect(useEditorStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Adds first Instrument", () => {
    const sheet = getEmptyMockSheet();
    const song: Song = { name: "", artist: "", instruments: [] };
    useEditorStore.setState(() => ({
      song,
    }));
    (createSheet as jest.Mock).mockImplementation(() => sheet);

    addInstrument(getMockInstrument());

    expect(createSheet).toBeCalledTimes(1);
    expect(createSheet).toBeCalledWith(8);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song,
      currentInstrumentIndex: 0,
    });
  });

  it("Adds Instrument with previous Instruments", () => {
    const initialSheet = getEmptyMockSheet();
    const sheet = getMockSheetWithBars();
    const song: Song = {
      name: "",
      artist: "",
      instruments: [getMockInstrument(initialSheet)],
    };
    useEditorStore.setState(() => ({
      song,
      currentSheet: initialSheet,
    }));
    (createSheet as jest.Mock).mockImplementation(() => sheet);

    addInstrument(getMockInstrument());

    expect(createSheet).toBeCalledTimes(1);
    expect(createSheet).toBeCalledWith(8);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isDirty: true,
      song,
      currentInstrumentIndex: 1,
    });
  });
});

describe("Set Current Instrument Index", () => {
  it("Sets state to received value", () => {
    setCurrentInstrumentIndex(8);

    expect(useEditorStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      currentInstrumentIndex: 8,
    });
  });
});
