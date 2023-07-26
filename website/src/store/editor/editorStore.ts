import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type Draft } from "immer";

import { type NoteDurationName, type Note } from "@entities/note";
import { type Octave } from "@entities/octave";
import { type Sheet } from "@entities/sheet";
import { type Song } from "@entities/song";
import {
  handleChangeHistory,
  produceUndoneableAction,
  type TaggedPatch,
} from "@/utils/immer";

export interface Cursor {
  trackIndex: number;
  barIndex: number;
  position: number;
}

export interface EditorStore {
  song: Song | undefined;
  currentSheetIndex: number | undefined;
  selectedOctave: Octave;
  selectedNoteDuration: NoteDurationName;
  noteToAdd: Note | null;
  cursor: Cursor;
  isDirty: boolean;
}

export const INITIAL_STATE: EditorStore = {
  song: undefined,
  currentSheetIndex: undefined,
  selectedOctave: 0,
  selectedNoteDuration: "LONG",
  noteToAdd: null,
  cursor: {
    trackIndex: 0,
    barIndex: 0,
    position: 0,
  },
  isDirty: false,
};

export const useEditorStore = create<EditorStore>()(
  devtools(() => INITIAL_STATE),
);

export const getCurrentSheet = (state?: EditorStore): Sheet | undefined => {
  const currentState = state ?? useEditorStore.getState();

  if (currentState.currentSheetIndex === undefined) return undefined;

  return currentState.song?.sheets[currentState.currentSheetIndex];
};

export const reset = () => useEditorStore.setState(INITIAL_STATE);

export const handleStorableAction = (draft: Draft<EditorStore>): void => {
  draft.isDirty = true;
};

export const undo = () =>
  useEditorStore.setState(state => handleChangeHistory(state, "undo"));

export const redo = () =>
  useEditorStore.setState(state => handleChangeHistory(state, "redo"));
