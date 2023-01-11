import { type DragEvent, useState, type FunctionComponent } from "react";
import { Button } from "../../components";
import { useAudioContext } from "../../hooks";
import { createNote, NOTE_DURATION, type NoteDurationName } from "../../server/entities/note";
import {
  createPitch,
  NUMBER_OF_OCTAVES,
  NUMBER_OF_PICHES_IN_OCTAVE,
  PitchDictionary,
  type PitchName,
  type Octave,
} from "../../server/entities/pitch";
import { playSong } from "../../server/entities/sheet";
import { useSheet } from "./Editor";

const NoteMenu: FunctionComponent = () => {
  const audioContext = useAudioContext();
  const { sheet, refresh: refreshSheet } = useSheet();
  const [selectedOctave, setSelectedOctave] = useState<Octave>(0);
  const [selectedDuration, setSelectedDuration] = useState<NoteDurationName>("LONG");

  if (sheet === undefined) return null;

  const handleDragStart = (_event: DragEvent<HTMLDivElement>, pitchName: string) => {
    const noteData = createNote(
      NOTE_DURATION[selectedDuration],
      createPitch(pitchName.substring(0, pitchName.length - 1) as PitchName, selectedOctave),
    );

    sheet.noteToAdd = noteData;
    refreshSheet();
  };

  const handlePlay = () => {
    playSong(sheet, audioContext);
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
              style={{ width: "100%", cursor: "pointer" }}
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
              style={{ width: "100%", cursor: "pointer" }}
            >
              {Object.keys(NOTE_DURATION).map((noteDuration, i) => (
                <option key={i}>{noteDuration}</option>
              ))}
            </select>
          </fieldset>
          <Button text="Play" variant="success" style={{ margin: "0px 4px", width: "6rem" }} onClick={handlePlay} />
        </div>
        <div style={{ display: "flex" }}>
          {Object.keys(PitchDictionary)
            .slice(0, NUMBER_OF_PICHES_IN_OCTAVE)
            .concat(["XX"])
            .map((pitchName, i) => (
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
                {pitchName.substring(0, pitchName.length - 1)}
              </div>
            ))}
        </div>
      </fieldset>
    </div>
  );
};

export default NoteMenu;
