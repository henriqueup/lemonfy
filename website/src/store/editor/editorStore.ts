import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { type NoteDurationName, type Note } from "@entities/note";
import { type Octave } from "@entities/octave";
import { type Sheet } from "@entities/sheet";
import { type Song } from "@entities/song";

export interface Cursor {
  trackIndex: number;
  barIndex: number;
  position: number;
}

export interface EditorStore {
  song: Song | undefined;
  currentSheet: Sheet | undefined;
  selectedOctave: Octave;
  selectedNoteDuration: NoteDurationName;
  noteToAdd: Note | null;
  cursor: Cursor;
}

export const INITIAL_STATE: EditorStore = {
  song: undefined,
  currentSheet: undefined,
  selectedOctave: 0,
  selectedNoteDuration: "LONG",
  noteToAdd: null,
  cursor: {
    trackIndex: 0,
    barIndex: 0,
    position: 0,
  },
};

export const useEditorStore = create<EditorStore>()(
  devtools(() => INITIAL_STATE),
);
