import { type DragEvent, useState, type FunctionComponent } from "react";
import { Button } from "../../components";
import { useAudioContext, useShortcuts } from "../../hooks";
import {
  getLowerNoteDuration,
  NOTE_DURATIONS,
  getHigherNoteDuration,
  type NoteDurationName,
} from "../../server/entities/note";
import { getLowerOctave, NUMBER_OF_OCTAVES, getHigherOctave, type Octave } from "../../server/entities/octave";
import { type PitchName, PITCH_NAMES } from "../../server/entities/pitch";
import { playSong } from "../../server/entities/sheet";
import {
  addNote,
  decreaseSelectedTrackIndex,
  increaseSelectedTrackIndex,
  setNoteToAdd,
  useEditorStore,
} from "../../store/editor";

const NoteMenu: FunctionComponent = () => {
  const audioContext = useAudioContext();
  const currentSheet = useEditorStore(state => state.currentSheet);

  const [selectedOctave, setSelectedOctave] = useState<Octave>(0);
  const [selectedDuration, setSelectedDuration] = useState<NoteDurationName>("LONG");

  useShortcuts({
    "octave.lower": {
      callback: () => setSelectedOctave(curr => getLowerOctave(curr)),
    },
    "octave.raise": {
      callback: () => setSelectedOctave(curr => getHigherOctave(curr)),
    },
    "duration.lower": {
      callback: () => setSelectedDuration(curr => getLowerNoteDuration(curr)),
    },
    "duration.raise": {
      callback: () => setSelectedDuration(curr => getHigherNoteDuration(curr)),
    },
    "track.select.above": {
      callback: decreaseSelectedTrackIndex,
    },
    "track.select.under": {
      callback: increaseSelectedTrackIndex,
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
              onChange={event => setSelectedDuration(event.target.value as NoteDurationName)}
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
