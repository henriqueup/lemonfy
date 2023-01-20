import { create } from "zustand";
import { createNote, type Note } from "../server/entities/note";
import { type Octave } from "../server/entities/octave";
import { createPitch, type PitchName } from "../server/entities/pitch";
import { addBarToSheet, addNoteToSheet, createSheet, type Sheet } from "../server/entities/sheet";

export interface EditorStore {
  sheets: Sheet[];
  currentSheet: Sheet | undefined;
  noteToAdd: Note | null;
}

export const useEditorStore = create<EditorStore>(() => ({
  sheets: [],
  currentSheet: undefined,
  noteToAdd: null,
}));

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

export const addNote = (barIndex: number, trackIndex: number, note: Note) =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    addNoteToSheet(state.currentSheet, barIndex, trackIndex, note);
    return { currentSheet: state.currentSheet };
  });

export const setNoteToAdd = (duration: number, pitchName: string, octave: Octave) =>
  useEditorStore.setState(() => {
    // TODO: create type for pitchName with octave and method to get pitchName from octave
    const pitch = createPitch(pitchName.substring(0, pitchName.length - 1) as PitchName, octave);
    const noteToAdd = createNote(duration, pitch);

    return { noteToAdd };
  });
