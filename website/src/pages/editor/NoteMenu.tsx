import { type DragEvent, type FunctionComponent } from "react";
import { Button } from "../../components";
import { useAudioContext, useShortcuts } from "../../hooks";
import { NOTE_DURATIONS, type NoteDurationName } from "../../server/entities/note";
import { NUMBER_OF_OCTAVES, type Octave } from "../../server/entities/octave";
import { type PitchName, PITCH_NAMES } from "../../server/entities/pitch";
import { playSong } from "../../server/entities/sheet";
import {
  addNote,
  decreaseCursorBarIndex,
  decreaseCursorPosition,
  decreaseCursorTrackIndex,
  decreseSelectedNoteDuration,
  decreseSelectedOctave,
  increaseCursorBarIndex,
  increaseCursorPosition,
  increaseCursorTrackIndex,
  increaseSelectedNoteDuration,
  increaseSelectedOctave,
  moveCursorToEndOfBar,
  moveCursorToStartOfBar,
  removeNextNoteFromBar,
  setNoteToAdd,
  setSelectedNoteDuration,
  setSelectedOctave,
  useEditorStore,
} from "../../store/editor";

const NoteMenu: FunctionComponent = () => {
  const audioContext = useAudioContext();
  const currentSheet = useEditorStore(state => state.currentSheet);
  const selectedOctave = useEditorStore(state => state.selectedOctave);
  const selectedDuration = useEditorStore(state => state.selectedNoteDuration);

  useShortcuts({
    "octave.lower": {
      callback: decreseSelectedOctave,
    },
    "octave.raise": {
      callback: increaseSelectedOctave,
    },
    "duration.lower": {
      callback: decreseSelectedNoteDuration,
    },
    "duration.raise": {
      callback: increaseSelectedNoteDuration,
    },
    "cursor.track.above": {
      callback: decreaseCursorTrackIndex,
    },
    "cursor.track.under": {
      callback: increaseCursorTrackIndex,
    },
    "cursor.bar.left": {
      callback: decreaseCursorBarIndex,
    },
    "cursor.bar.right": {
      callback: increaseCursorBarIndex,
    },
    "cursor.position.left": {
      callback: decreaseCursorPosition,
    },
    "cursor.position.right": {
      callback: increaseCursorPosition,
    },
    "cursor.position.startOfBar": {
      callback: moveCursorToStartOfBar,
    },
    "cursor.position.endOfBar": {
      callback: moveCursorToEndOfBar,
    },
    "notes.add.C": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "C", selectedOctave),
    },
    "notes.add.C#": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "C#", selectedOctave),
    },
    "notes.add.D": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "D", selectedOctave),
    },
    "notes.add.D#": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "D#", selectedOctave),
    },
    "notes.add.E": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "E", selectedOctave),
    },
    "notes.add.F": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "F", selectedOctave),
    },
    "notes.add.F#": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "F#", selectedOctave),
    },
    "notes.add.G": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "G", selectedOctave),
    },
    "notes.add.G#": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "G#", selectedOctave),
    },
    "notes.add.A": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "A", selectedOctave),
    },
    "notes.add.A#": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "A#", selectedOctave),
    },
    "notes.add.B": {
      callback: () => addNote(NOTE_DURATIONS[selectedDuration], "B", selectedOctave),
    },
    "notes.remove.left": {
      callback: () => removeNextNoteFromBar(false),
    },
    "notes.remove.right": {
      callback: removeNextNoteFromBar,
    },
  });

  if (currentSheet === undefined) return null;

  const handleDragStart = (_event: DragEvent<HTMLDivElement>, pitchName: PitchName) => {
    setNoteToAdd(NOTE_DURATIONS[selectedDuration], pitchName, selectedOctave);
  };

  const handlePlay = () => {
    playSong(currentSheet, audioContext);
  };

  return (
    <div style={{ height: "40%", padding: "8px 16px 16px 16px" }}>
      <fieldset style={{ height: "100%", padding: "16px", border: "1px solid lightgray", borderRadius: "4px" }}>
        <legend>Note Selector</legend>
        <div style={{ display: "flex", marginBottom: "16px" }}>
          <fieldset style={{ borderRadius: "8px", padding: "5px", width: "6rem", margin: "0px 4px" }}>
            <legend>Octave</legend>
            <select
              value={selectedOctave}
              onChange={event => setSelectedOctave(Number(event.target.value) as Octave)}
              style={{ width: "100%", color: "black", cursor: "pointer" }}
            >
              {[...Array(NUMBER_OF_OCTAVES).keys()].map((octave, i) => (
                <option key={i}>{octave}</option>
              ))}
            </select>
          </fieldset>
          <fieldset style={{ borderRadius: "8px", padding: "5px", width: "calc(12rem + 8px)", margin: "0px 4px" }}>
            <legend>Duration</legend>
            <select
              value={selectedDuration}
              onChange={event => setSelectedNoteDuration(event.target.value as NoteDurationName)}
              style={{ width: "100%", color: "black", cursor: "pointer" }}
            >
              {Object.keys(NOTE_DURATIONS).map((noteDuration, i) => (
                <option key={i}>{noteDuration}</option>
              ))}
            </select>
          </fieldset>
          <Button text="Play" variant="success" style={{ margin: "0px 4px", width: "6rem" }} onClick={handlePlay} />
        </div>
        <div style={{ display: "flex" }}>
          {PITCH_NAMES.map((pitchName, i) => (
            <div
              key={i}
              draggable={true}
              onDragStart={event => handleDragStart(event, pitchName)}
              style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                fontSize: "4rem",
                minWidth: "6rem",
                minHeight: "6rem",
                margin: "4px",
                border: "1px solid lightgray",
                borderRadius: "16px",
                cursor: "pointer",
              }}
            >
              {pitchName}
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default NoteMenu;
