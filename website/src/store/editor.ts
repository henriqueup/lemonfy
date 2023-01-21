import { create } from "zustand";
import { createNote, type Note } from "../server/entities/note";
import { type Octave } from "../server/entities/octave";
import { createPitch, type PitchName } from "../server/entities/pitch";
import { addBarToSheet, addNoteToSheet, createSheet, type Sheet } from "../server/entities/sheet";

export interface EditorStore {
  sheets: Sheet[];
  currentSheet: Sheet | undefined;
  noteToAdd: Note | null;
  selectedTrackIndex: number;
}

export const useEditorStore = create<EditorStore>(() => ({
  sheets: [],
  currentSheet: undefined,
  noteToAdd: null,
  selectedTrackIndex: 0,
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

export const addNote = (duration: number, pitchName: PitchName, octave: Octave) =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    const pitch = createPitch(pitchName, octave);
    const noteToAdd = createNote(duration, pitch);

    addNoteToSheet(state.currentSheet, 0, state.selectedTrackIndex, noteToAdd);
    return { currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] } };
  });

export const addNoteFromDrop = (barIndex: number, trackIndex: number, note: Note) =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    addNoteToSheet(state.currentSheet, barIndex, trackIndex, note);
    return { currentSheet: { ...state.currentSheet, bars: [...state.currentSheet.bars] } };
  });

export const setNoteToAdd = (duration: number, pitchName: PitchName, octave: Octave) =>
  useEditorStore.setState(() => {
    const pitch = createPitch(pitchName, octave);
    const noteToAdd = createNote(duration, pitch);

    return { noteToAdd };
  });

export const increaseSelectedTrackIndex = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};
    if (state.selectedTrackIndex === state.currentSheet?.trackCount - 1) return {};

    return { selectedTrackIndex: state.selectedTrackIndex + 1 };
  });

export const decreaseSelectedTrackIndex = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};
    if (state.selectedTrackIndex === 0) return {};

    return { selectedTrackIndex: state.selectedTrackIndex - 1 };
  });
