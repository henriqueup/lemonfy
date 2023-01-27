import {
  createNote,
  getHigherNoteDuration,
  getLowerNoteDuration,
  type NoteDurationName,
} from "../../server/entities/note";
import { getHigherOctave, getLowerOctave, type Octave } from "../../server/entities/octave";
import { createPitch, type PitchName } from "../../server/entities/pitch";
import { useEditorStore } from "./editorStore";

export const setNoteToAdd = (duration: number, pitchName: PitchName, octave: Octave) =>
  useEditorStore.setState(() => {
    const pitch = createPitch(pitchName, octave);
    const noteToAdd = createNote(duration, -1, pitch);

    return { noteToAdd };
  });

export const setSelectedOctave = (octave: Octave) => useEditorStore.setState(() => ({ selectedOctave: octave }));

export const increaseSelectedOctave = () =>
  useEditorStore.setState(state => ({ selectedOctave: getHigherOctave(state.selectedOctave) }));

export const decreseSelectedOctave = () =>
  useEditorStore.setState(state => ({ selectedOctave: getLowerOctave(state.selectedOctave) }));

export const setSelectedNoteDuration = (duration: NoteDurationName) =>
  useEditorStore.setState(() => ({ selectedNoteDuration: duration }));

export const increaseSelectedNoteDuration = () =>
  useEditorStore.setState(state => ({ selectedNoteDuration: getHigherNoteDuration(state.selectedNoteDuration) }));

export const decreseSelectedNoteDuration = () =>
  useEditorStore.setState(state => ({ selectedNoteDuration: getLowerNoteDuration(state.selectedNoteDuration) }));
