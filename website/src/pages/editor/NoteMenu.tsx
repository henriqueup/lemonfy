import { type DragEvent, type FunctionComponent } from "react";
import { Button } from "../../components";
import { useAudioContext, useShortcuts } from "../../hooks";
import { NOTE_DURATIONS, type NoteDurationName } from "@entities/note";
import { NUMBER_OF_OCTAVES, type Octave } from "@entities/octave";
import { type PitchName, PITCH_NAMES } from "@entities/pitch";
import { playSong } from "@entities/sheet";
import { useEditorStore } from "@store/editor";
import {
  decreaseSelectedNoteDuration,
  decreaseSelectedOctave,
  increaseSelectedNoteDuration,
  increaseSelectedOctave,
  setNoteToAdd,
  setSelectedNoteDuration,
  setSelectedOctave,
} from "@store/editor/noteToAddActions";
import {
  decreaseCursorBarIndex,
  decreaseCursorPosition,
  decreaseCursorTrackIndex,
  increaseCursorBarIndex,
  increaseCursorPosition,
  increaseCursorTrackIndex,
  moveCursorToEndOfBar,
  moveCursorToStartOfBar,
} from "@store/editor/cursorActions";
import { addNote, removeNextNoteFromBar } from "@store/editor/sheetActions";
import { Select } from "@components/select";
import { classNames } from "src/styles/utils";

const NoteMenu: FunctionComponent = () => {
  const audioContext = useAudioContext();
  const currentSheet = useEditorStore(state => state.currentSheet);
  const selectedOctave = useEditorStore(state => state.selectedOctave);
  const selectedDuration = useEditorStore(state => state.selectedNoteDuration);

  useShortcuts({
    "octave.lower": {
      callback: decreaseSelectedOctave,
    },
    "octave.raise": {
      callback: increaseSelectedOctave,
    },
    "duration.lower": {
      callback: decreaseSelectedNoteDuration,
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
    <div className="h-2/5 bg-inherit p-4 pt-2 text-gray-400">
      <fieldset className="h-full rounded border border-solid border-gray-400 bg-inherit p-4">
        <legend>Note Selector</legend>
        <div className="mb-4 flex w-full bg-inherit">
          <Select
            label="Octave"
            value={selectedOctave}
            options={[...Array(NUMBER_OF_OCTAVES).keys()]}
            handleChange={newKey => setSelectedOctave(Number(newKey) as Octave)}
            disableClear
            className="ml-1 mr-1 w-[calc(100%_/_13_-_8px)]"
          />
          <Select
            label="Duration"
            value={selectedDuration}
            options={Object.keys(NOTE_DURATIONS)}
            handleChange={newKey => setSelectedNoteDuration(newKey as NoteDurationName)}
            disableClear
            className="ml-1 mr-1 w-[calc(100%_/_13_*_2_-_8px)]"
          />
          <Button text="Play" variant="success" className="ml-1 mr-1 w-[calc(100%_/_13_-_8px)]" onClick={handlePlay} />
        </div>
        <div className="flex w-full">
          {PITCH_NAMES.map((pitchName, i) => (
            <div
              key={i}
              draggable={true}
              onDragStart={event => handleDragStart(event, pitchName)}
              className={classNames(
                "m-1 flex min-h-[5rem] min-w-[calc(100%_/_13_-_8px)] cursor-pointer items-center justify-center",
                "rounded-2xl border border-solid border-gray-400 text-6xl text-gray-400",
              )}
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
