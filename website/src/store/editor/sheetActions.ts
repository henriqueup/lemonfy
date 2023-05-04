import { createNote, type Note } from "@entities/note";
import { type Octave } from "@entities/octave";
import { createPitch, type PitchName } from "@entities/pitch";
import SheetModule from "@entities/sheet";
import { useEditorStore, getCurrentSheet } from "./editorStore";

export const addBar = (beatCount: number, dibobinador: number, tempo: number) =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    SheetModule.addBarToSheet(currentSheet, beatCount, dibobinador, tempo);

    return { song: { ...state.song } };
  });

export const addCopyOfCurrentBar = () =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    const currentBar = currentSheet.bars[state.cursor.barIndex];
    if (currentBar === undefined) return {};

    SheetModule.addBarToSheet(
      currentSheet,
      currentBar.beatCount,
      currentBar.dibobinador,
      currentBar.tempo,
      state.cursor.barIndex,
    );

    return { song: { ...state.song } };
  });

export const addNote = (
  duration: number,
  pitchName: PitchName,
  octave: Octave,
) =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    const barWithCursor = currentSheet.bars[state.cursor.barIndex];
    if (barWithCursor === undefined) return {};

    const startOfNoteToAdd = barWithCursor.start + state.cursor.position;
    const pitch = createPitch(pitchName, octave);
    const noteToAdd = createNote(duration, startOfNoteToAdd, pitch);

    SheetModule.addNoteToSheet(
      currentSheet,
      state.cursor.trackIndex,
      noteToAdd,
    );
    SheetModule.fillBarTracksInSheet(currentSheet, state.cursor.trackIndex);

    const endOfAddedNote = state.cursor.position + noteToAdd.duration;
    return {
      song: { ...state.song },
      cursor: {
        ...state.cursor,
        position: Math.min(endOfAddedNote, barWithCursor.capacity),
      },
    };
  });

export const addNoteFromDrop = (
  barIndex: number,
  trackIndex: number,
  note: Note,
) =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    SheetModule.addNoteToSheet(currentSheet, trackIndex, note);
    SheetModule.fillBarTracksInSheet(currentSheet, state.cursor.trackIndex);

    return { song: { ...state.song } };
  });

export const removeNoteFromBar = (noteToRemove: Note) =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    SheetModule.removeNotesFromSheet(currentSheet, state.cursor.trackIndex, [
      noteToRemove,
    ]);
    SheetModule.fillBarTracksInSheet(currentSheet, state.cursor.trackIndex);

    return { song: { ...state.song } };
  });

export const removeNextNoteFromBar = (lookForward = true) =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    const barWithCursor = currentSheet.bars[state.cursor.barIndex];
    if (barWithCursor === undefined) return {};

    const noteToRemove = SheetModule.findSheetNoteByTime(
      currentSheet,
      state.cursor.trackIndex,
      barWithCursor.start + state.cursor.position,
      lookForward,
    );
    if (noteToRemove === null) return {};

    SheetModule.removeNotesFromSheet(currentSheet, state.cursor.trackIndex, [
      noteToRemove,
    ]);
    SheetModule.fillBarTracksInSheet(currentSheet, state.cursor.trackIndex);

    if (lookForward) {
      return { song: { ...state.song } };
    }

    if (state.cursor.position > 0) {
      return {
        song: { ...state.song },
        cursor: {
          ...state.cursor,
          position: state.cursor.position - noteToRemove.duration,
        },
      };
    }

    const newBarIndex = state.cursor.barIndex - 1;
    const previousBar = currentSheet.bars[newBarIndex];

    if (previousBar === undefined)
      throw new Error("There should be a previous bar.");

    return {
      song: { ...state.song },
      cursor: {
        ...state.cursor,
        barIndex: newBarIndex,
        position: previousBar.capacity - noteToRemove.duration,
      },
    };
  });

export const removeBarFromSheetByIndex = (barIndex: number) =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    SheetModule.removeBarInSheetByIndex(currentSheet, barIndex);

    return { song: { ...state.song } };
  });
