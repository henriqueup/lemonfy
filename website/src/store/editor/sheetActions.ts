import { createNote, type Note } from "../../server/entities/note";
import { type Octave } from "../../server/entities/octave";
import { createPitch, type PitchName } from "../../server/entities/pitch";
import {
  addBarToSheet,
  addNoteToSheet,
  createSheet,
  fillBarTracksInSheet,
  findSheetNoteByTime,
  removeNotesFromSheet,
  type Sheet,
} from "../../server/entities/sheet";
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

    const pitch = createPitch(pitchName, octave);
    const noteToAdd = createNote(duration, state.cursor.position, pitch);

    addNoteToSheet(state.currentSheet, state.cursor.trackIndex, noteToAdd);
    fillBarTracksInSheet(state.currentSheet, state.cursor.trackIndex);

    const endOfBarWithCursor = barWithCursor.start + barWithCursor.capacity;
    return {
      currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] },
      cursor: { ...state.cursor, position: Math.min(state.cursor.position + noteToAdd.duration, endOfBarWithCursor) },
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

    let newCursorPosition = state.cursor.position;
    if (!lookForward) newCursorPosition -= noteToRemove.duration;

    return {
      currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] },
      cursor: { ...state.cursor, position: newCursorPosition },
    };
  });
