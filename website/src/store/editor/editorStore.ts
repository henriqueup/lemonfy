import { create } from "zustand";
import { type NoteDurationName, type Note } from "../../server/entities/note";
import { type Octave } from "../../server/entities/octave";
import { type Sheet } from "../../server/entities/sheet";

export interface Cursor {
  trackIndex: number;
  barIndex: number;
  position: number;
}

export interface EditorStore {
  sheets: Sheet[];
  currentSheet: Sheet | undefined;
  selectedOctave: Octave;
  selectedNoteDuration: NoteDurationName;
  noteToAdd: Note | null;
  cursor: Cursor;
}

export const useEditorStore = create<EditorStore>(() => ({
  sheets: [],
  currentSheet: undefined,
  selectedOctave: 0,
  selectedNoteDuration: "LONG",
  noteToAdd: null,
  cursor: {
    trackIndex: 0,
    barIndex: 0,
    position: 0,
  },
}));
