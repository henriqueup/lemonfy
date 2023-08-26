import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type Draft } from "immer";

import { type NoteDurationName, type Note } from "@entities/note";
import { type Octave } from "@entities/octave";
import { type Sheet } from "@entities/sheet";
import { type Song } from "@entities/song";
import { handleChangeHistory } from "@/utils/immer";
import { type Instrument } from "@/server/entities/instrument";

export interface Cursor {
  trackIndex: number;
  barIndex: number;
  position: number;
}

export interface EditorStore {
  song: Song | undefined;
  currentInstrumentIndex: number | undefined;
  selectedOctave: Octave;
  selectedNoteDuration: NoteDurationName;
  typedFret: string;
  noteToAdd: Note | null;
  cursor: Cursor;
  isDirty: boolean;
}

export const INITIAL_STATE: EditorStore = {
  song: undefined,
  currentInstrumentIndex: undefined,
  selectedOctave: 0,
  selectedNoteDuration: "LONG",
  typedFret: "",
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

export const getCurrentInstrument = (
  state?: EditorStore,
): Instrument | undefined => {
  const currentState = state ?? useEditorStore.getState();

  if (currentState.currentInstrumentIndex === undefined) return undefined;

  return currentState.song?.instruments[currentState.currentInstrumentIndex];
};

export const getCurrentSheet = (state?: EditorStore): Sheet | undefined => {
  return getCurrentInstrument(state)?.sheet;
};

export const reset = () => useEditorStore.setState(INITIAL_STATE);

export const handleStorableAction = (draft: Draft<EditorStore>): void => {
  draft.isDirty = true;
};

export const undo = () =>
  useEditorStore.setState(state => handleChangeHistory(state, "undo"));

export const redo = () =>
  useEditorStore.setState(state => handleChangeHistory(state, "redo"));
