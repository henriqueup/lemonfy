import { createNote, type Note } from "@entities/note";
import { type Octave } from "@entities/octave";
import { createPitch, type PitchName } from "@entities/pitch";
import {
  addBarToSheet,
  addNoteToSheet,
  fillBarTracksInSheet,
  findSheetNoteByTime,
  removeBarInSheetByIndex,
  removeNotesFromSheet,
} from "@entities/sheet";
import {
  useEditorStore,
  getCurrentSheet,
  handleStorableAction,
} from "./editorStore";
import { produceUndoneableAction } from "@/utils/immer";

export const addBar = (beatCount: number, dibobinador: number, tempo: number) =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      if (draft.song === undefined) return;

      const currentSheet = getCurrentSheet(draft);
      if (currentSheet === undefined) return;

      addBarToSheet(currentSheet, beatCount, dibobinador, tempo);
      handleStorableAction(draft);
    }),
  );

export const addCopyOfCurrentBar = () =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      if (draft.song === undefined) return;

      const currentSheet = getCurrentSheet(draft);
      if (currentSheet === undefined) return;

      const currentBar = currentSheet.bars[draft.cursor.barIndex];
      if (currentBar === undefined) return;

      addBarToSheet(
        currentSheet,
        currentBar.beatCount,
        currentBar.dibobinador,
        currentBar.tempo,
        draft.cursor.barIndex,
      );
      handleStorableAction(draft);
    }),
  );

export const addNote = (
  duration: number,
  pitchName: PitchName,
  octave: Octave,
) =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      if (draft.song === undefined) return;

      const currentSheet = getCurrentSheet(draft);
      if (currentSheet === undefined) return;

      const barWithCursor = currentSheet.bars[draft.cursor.barIndex];
      if (barWithCursor === undefined) return;

      const startOfNoteToAdd = barWithCursor.start + draft.cursor.position;
      const pitch = createPitch(pitchName, octave);
      const noteToAdd = createNote(duration, startOfNoteToAdd, pitch);

      addNoteToSheet(currentSheet, draft.cursor.trackIndex, noteToAdd);
      fillBarTracksInSheet(currentSheet, draft.cursor.trackIndex);
      handleStorableAction(draft);

      const endOfAddedNote = draft.cursor.position + noteToAdd.duration;
      draft.cursor.position = Math.min(endOfAddedNote, barWithCursor.capacity);
    }),
  );

export const removeNoteFromBar = (noteToRemove: Note) =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      if (draft.song === undefined) return;

      const currentSheet = getCurrentSheet(draft);
      if (currentSheet === undefined) return;

      removeNotesFromSheet(currentSheet, draft.cursor.trackIndex, [
        noteToRemove,
      ]);
      fillBarTracksInSheet(currentSheet, draft.cursor.trackIndex);
      handleStorableAction(draft);
    }),
  );

export const removeNextNoteFromBar = (lookForward = true) =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      if (draft.song === undefined) return;

      const currentSheet = getCurrentSheet(draft);
      if (currentSheet === undefined) return;

      const barWithCursor = currentSheet.bars[draft.cursor.barIndex];
      if (barWithCursor === undefined) return;

      const noteToRemove = findSheetNoteByTime(
        currentSheet,
        draft.cursor.trackIndex,
        barWithCursor.start + draft.cursor.position,
        lookForward,
      );
      if (noteToRemove === null) return;

      removeNotesFromSheet(currentSheet, draft.cursor.trackIndex, [
        noteToRemove,
      ]);
      fillBarTracksInSheet(currentSheet, draft.cursor.trackIndex);
      handleStorableAction(draft);

      if (lookForward) {
        return;
      }

      if (draft.cursor.position > 0) {
        draft.cursor.position = draft.cursor.position - noteToRemove.duration;
        return;
      }

      const newBarIndex = draft.cursor.barIndex - 1;
      const previousBar = currentSheet.bars[newBarIndex];

      if (previousBar === undefined)
        throw new Error("There should be a previous bar.");

      draft.cursor.barIndex = newBarIndex;
      draft.cursor.position = previousBar.capacity - noteToRemove.duration;
    }),
  );

export const removeBarFromSheetByIndex = (barIndex: number) =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      if (draft.song === undefined) return;

      const currentSheet = getCurrentSheet(draft);
      if (currentSheet === undefined) return;

      removeBarInSheetByIndex(currentSheet, barIndex);
      handleStorableAction(draft);
    }),
  );
