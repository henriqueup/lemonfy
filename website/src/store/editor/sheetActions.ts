import { createNote, type Note } from "@entities/note";
import { type Octave } from "@entities/octave";
import { createPitch, type PitchName } from "@entities/pitch";
import {
  addBarToSheet,
  addNoteToSheet,
  createSheet,
  fillBarTracksInSheet,
  findSheetNoteByTime,
  removeNotesFromSheet,
  removeBarInSheetByIndex,
  type Sheet,
} from "@entities/sheet";
import { useEditorStore } from "./editorStore";

export const loadSheet = (sheet: Sheet) => useEditorStore.setState({ currentSheet: sheet });

export const addSheet = (trackCount: number) =>
  useEditorStore.setState(state => {
    const newSheet = createSheet(trackCount);

    return {
      sheets: [...state.sheets, newSheet],
      currentSheet: newSheet,
    };
  });

export const addBar = (beatCount: number, dibobinador: number, tempo: number) =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    addBarToSheet(state.currentSheet, beatCount, dibobinador, tempo);
    return { currentSheet: state.currentSheet };
  });

export const addNote = (duration: number, pitchName: PitchName, octave: Octave) =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    const barWithCursor = state.currentSheet.bars[state.cursor.barIndex];
    if (barWithCursor === undefined) return {};

    const startOfNoteToAdd = barWithCursor.start + state.cursor.position;
    const pitch = createPitch(pitchName, octave);
    const noteToAdd = createNote(duration, startOfNoteToAdd, pitch);

    addNoteToSheet(state.currentSheet, state.cursor.trackIndex, noteToAdd);
    fillBarTracksInSheet(state.currentSheet, state.cursor.trackIndex);

    const endOfAddedNote = state.cursor.position + noteToAdd.duration;
    return {
      currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] },
      cursor: { ...state.cursor, position: Math.min(endOfAddedNote, barWithCursor.capacity) },
    };
  });

export const addNoteFromDrop = (barIndex: number, trackIndex: number, note: Note) =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    addNoteToSheet(state.currentSheet, trackIndex, note);
    fillBarTracksInSheet(state.currentSheet, state.cursor.trackIndex);

    return { currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] } };
  });

export const removeNoteFromBar = (noteToRemove: Note) =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    removeNotesFromSheet(state.currentSheet, state.cursor.trackIndex, [noteToRemove]);
    fillBarTracksInSheet(state.currentSheet, state.cursor.trackIndex);

    return { currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] } };
  });

export const removeNextNoteFromBar = (lookForward = true) =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    const barWithCursor = state.currentSheet.bars[state.cursor.barIndex];
    if (barWithCursor === undefined) return {};

    const noteToRemove = findSheetNoteByTime(
      state.currentSheet,
      state.cursor.trackIndex,
      barWithCursor.start + state.cursor.position,
      lookForward,
    );
    if (noteToRemove === null) return {};

    removeNotesFromSheet(state.currentSheet, state.cursor.trackIndex, [noteToRemove]);
    fillBarTracksInSheet(state.currentSheet, state.cursor.trackIndex);

    if (lookForward) {
      return {
        currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] },
      };
    }

    if (state.cursor.position > 0) {
      return {
        currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] },
        cursor: { ...state.cursor, position: state.cursor.position - noteToRemove.duration },
      };
    }

    const newBarIndex = state.cursor.barIndex - 1;
    const previousBar = state.currentSheet.bars[newBarIndex];

    if (previousBar === undefined) throw new Error("There should be a previous bar.");

    return {
      currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] },
      cursor: {
        ...state.cursor,
        barIndex: newBarIndex,
        position: previousBar.capacity - noteToRemove.duration,
      },
    };
  });

export const removeBarFromSheetByIndex = (barIndex: number) =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    removeBarInSheetByIndex(state.currentSheet, barIndex);

    return { currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] } };
  });
