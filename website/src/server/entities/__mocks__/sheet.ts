import type * as Module from "@/server/entities/sheet";

const actualModule = jest.requireActual<typeof Module>(
  "@/server/entities/sheet",
);
const SheetSchema = actualModule.SheetSchema;

const addBarToSheet = jest.fn();
const addNoteToSheet = jest.fn();
const createSheet = jest.fn();
const fillBarsInSheet = jest.fn();
const fillBarTracksInSheet = jest.fn();
const findSheetNoteByTime = jest.fn();
const removeBarInSheetByIndex = jest.fn();
const removeNotesFromSheet = jest.fn();

beforeEach(() => {
  addBarToSheet.mockReset();
  addNoteToSheet.mockReset();
  createSheet.mockReset();
  fillBarsInSheet.mockReset();
  fillBarTracksInSheet.mockReset();
  findSheetNoteByTime.mockReset();
  removeBarInSheetByIndex.mockReset();
  removeNotesFromSheet.mockReset();
});

export {
  addBarToSheet,
  addNoteToSheet,
  createSheet,
  fillBarsInSheet,
  fillBarTracksInSheet,
  findSheetNoteByTime,
  removeBarInSheetByIndex,
  removeNotesFromSheet,
  SheetSchema,
};
